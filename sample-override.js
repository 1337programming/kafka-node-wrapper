const KafkaWrapper = require('./src/index');


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
    this.consumer = new KafkaWrapper.consumer({consumeMax: this.limit, autoInterval: false});
    this.producer = new KafkaWrapper.producer();
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
    await cbWrapper(message);
    await doStuff(message);
    this.consumer.consume(1);
    this.consumer.commit()
  }

}
