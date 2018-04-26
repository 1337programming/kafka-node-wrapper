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

// main();

module.exports = {
  consumer: consumer,
  producer: producer,
  consumerEvent: consumerEvent,
  producerEvent: producerEvent
};
