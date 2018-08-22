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
      this.consumer.onMessage().subscribe(async (message) => {
        this._stopConsuming(); // Got a message stop consuming (this will not cancel other consumed messages)
        await this._process(message); // Process Message
        this._startConsuming(1); // Consume the next message
      });

      // Logging
      this.consumer.onError().subscribe((err) => {
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

