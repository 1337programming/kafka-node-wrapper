# Kafka Docker Wrapper

### Running

* run `npm install`
* run `docker-compose up`

You can now see the producer tab making new messages and the consumer tab reading those messages. You can start more producers (while still running 1 consumer) and see more messages coming in.

### Topic Errors

If you are getting an error about the topic not existing, try running `docker-compose rm` to delete the containers. Then re-run `docker-compose up` again.

## Use

Install
`$ npm install kafka-node-wrapper --save`

```javascript
const Kafka = require('kafka-node-wrapper'); // Node < 9.x
// import * as Kafka from 'kafka-node-wrapper' // Node > 9.x

const consumer = new Kafka.consumer();
const producer = new Kafka.producer();

// Connect with producer and consumer in parallel
function connect() {
  return Promise.all[consumer.connect(), producer.connect()];
}

function events() {
  // Consumer Events
  consumer.message()
    .subscribe((data) => {
      console.log('Data', data);
    });
  consumer.error()
    .subscribe((err) => {
      console.log('Consumer Error', err);
    });

  // Producer Events
  producer.report()
    .subscribe((report) => {
      console.log('Producer Delivery Report', report);
    });
  producer.error()
    .subscribe((err) => {
      console.log('Producer Error', err);
    });

}


// DEMO!
connect()
  .then(() => {
    events();
    return producer.publish(JSON.stringify({foo: 1, bar: 2}));
  })
  .catch((err) => {
    console.error('Error!', err.message);
  });
```

## Configuration

### All

Configurations custom to this wrapper

|   Field    | Description|   Type     | Default   |
|------------|------------|------------|-----------|
| throttle   | Throttle interval time (ms) | Number | 500|
| topics     | Topics to subscribe to  | String[]  | \['kafka-test-topic'\] |
| autoInterval | Allow auto intervals for polling (producer) and consuming (consumer). | boolean  | true |

### Consumer

Configurations custom to this wrapper's Consumer class.

|   Field    | Description|   Type     | Default   |
|------------|------------|------------|-----------|
| consumeMax   | Number of messages to consume for each interval. | Number | 1 |

This rest of the configuration is described [here](https://raw.githubusercontent.com/edenhill/librdkafka/0.11.1.x/CONFIGURATION.md).

## Examples

#### Basic Usage

Sample code for sample pub sub.
```javascript
const Kafka = require('./src/index');

const consumer = new Kafka.consumer();
const producer = new Kafka.producer();

/**
 * @param {Consumer} con
 * @return {Promise<any>} data
 */
function consumerEvent(con) {
  return new Promise((resolve, reject) => {
    con.message()
      .subscribe((data) => {
        resolve(data);
        console.log('SAMPLE Consumer Data:', data);
      });
    con.error()
      .subscribe((err) => {
        reject(err);
        console.log('SAMPLE Consumer Error:', err);
      });
    console.log('SAMPLE Consumer Connected');
    con.log()
      .subscribe((log) => {
        console.log('SAMPLE log', log);
      });
  });
}

/**
 * @param pro
 * @return {Promise<any>}
 */
function producerEvent(pro) {
  return new Promise((resolve, reject) => {
    pro.report()
      .subscribe((report) => {
        console.log('SAMPLE Producer Delivery Report:', report);
        return resolve(report);
      });
    pro.error()
      .subscribe((err) => {
        console.log('SAMPLE Producer Error:', err);
        return reject(err);
      });
    console.log('SAMPLE Producer Connected');
    const message = {
      foo: 1,
      bar: 2
    };
    pro.publish(JSON.stringify(message));
  });
}

function main() {

  Promise.all([consumer.connect(), producer.connect()])
    .then(() => {
      return Promise.all([consumerEvent(consumer), producerEvent(producer)]);
    })
    .then((data) => {
      console.log('DATA', data);
      return Promise.all([consumer.disconnect(), producer.disconnect()]);
    })
    .then(() => {
      console.log('Disconnected');
    })
    .catch((err) => {
      console.error('Error', err);
    });

}

main();

module.exports = {
  consumer: consumer,
  producer: producer,
  consumerEvent: consumerEvent,
  producerEvent: producerEvent
};

```

#### Overriding

Sample code for doing your own pulling or commit/consume

```javascript
const KafkaWrapper = require('./src/index');

/* ARBITRARY EXTERNAL CODE BEGIN */
/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 * @callback requestCallback
 * @param {{name: string, age: number}} responseCode
 */
/**
 * Some stuff that has a callback (maybe write to a database or whatever)
 * @param data
 * @param {requestCallback} cb
 */
function doStuffCB(data, cb) {
  setTimeout(() => {
    console.log('Did stuff to data');
    return cb({name: 'Mary', age: 42});
  }, 500);
}

/**
 * Promise Wrapper for our doStuffCB function
 * @param {Object} data - some data
 * @return {Promise<{name: string, age: number}>}
 */
async function cbWrapper(data) {
  return new Promise((resolve, reject) => {
    doStuffCB(data, (user) => {
      return resolve(user);
    });
  });
}

/**
 * Does stuff
 * @param {Object} data - some data
 * @return {Promise<{name: string, age: number}>}
 */
async function doStuff(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Did more stuff to data');
      return resolve({name: 'Bob', age: 40});
    }, 500);
  });
}
/* ARBITRARY EXTERNAL CODE END */

class SampleOverride {

  constructor() {
    this._interval = null;
    this.consumer = new KafkaWrapper.consumer({consumeMax: 10, autoInterval: false, topics: ['upload-user']}); // we must consume/commit ourselves
    this.producer = new KafkaWrapper.producer({topics: ['upload-user']});
  }

  /**
   * Run Service
   * @param message
   * @return {Promise<void>}
   */
  async run(message) {
    // Connect
    await this.consumer.connect();
    await this.producer.connect();
    return await this._scenario();
  }

  async _scenario() {
    return new Promise(async (resolve, reject) => {
      // Send message to publish something
      await this.producer.publish(JSON.stringify({name: 'Dave', age: 38}));

      // Start consuming 1 message every 500 ms
      this._startConsuming(1);

      // Listen to Messages
      this.consumer.message().subscribe(async (message) => {
        this._stopConsuming(); // Got a message stop consuming (this will not cancel other consumed messages)
        await this._process(message); // Process Message
        this._startConsuming(1); // Consume the next message
      });

      // Logging
      this.consumer.error().subscribe((err) => {
        console.error(err);
      });

      // End scenario based on some condition
      setTimeout(async () => {
        await this.producer.disconnect();
        await this.consumer.disconnect();
        return resolve();
      }, 20000); // 20 seconds
    });

  }

  /**
   * Process Function
   * @param message
   * @return {Promise<DeliveryReport>}
   */
  async _process(message) {
    const user1 = await cbWrapper(message); // Step 1
    const user2 = await doStuff(message); // Step 2
    const output = {
      user1: user1,
      user2: user2
    };
    return await this.producer.publish(JSON.stringify(output)); // Step 3 - Send
  }

  _startConsuming(numMessages) {
    this._interval = setInterval(() => {
      this.consumer.consume(numMessages);
    }, 500);
  }

  _stopConsuming() {
    clearInterval(this._interval);
  }
}

const override = new SampleOverride();
override.run({foo: 1, bar: 2})
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error', err);
  });

```