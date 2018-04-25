const Kafka = require('./src/index');


// Example override Usage

// some stuff that has a callback (maybe write to a database or whatever)
function doStuffCB(data, cb) {
  setTimeout(() => {
    console.log('Did stuff to data');
    return cb();
  }, 500);
}

// Wrapper around doStuffCB
async function cbWrapper(data) {
  return new Promise((resolve, reject) => {
    doStuffCB(data, () => {
      return resolve();
    });
  });
}

async function doStuff(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Did more stuff to data');
      return resolve();
    }, 500);
  });
}

class SampleOverride {

  constructor() {
    this.limit = 10;
    this.consumer = new Kafka.consumer({consumeMax: this.limit, autoInterval: false});
    this.producer = new Kafka.producer();
  }

  async run(message) {
    await this.consumer.connect();
    await this.producer.connect();
    this.consumer.consume(); // Init
    this.consumer.message().subscribe(async (message) => {
      await process(message);
    });
    this.consumer.error().subscribe((err) => {
      /// log errors
    });
  }

  async process(message): void {

  }

  async operation(message) {

  }

}
async function main() {
  // Connect
  await producer.connect();
  await consumer.connect();


}

async function process() {

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

// main();

module.exports = {
  consumer: consumer,
  producer: producer,
  consumerEvent: consumerEvent,
  producerEvent: producerEvent
};
