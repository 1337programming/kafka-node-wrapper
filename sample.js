const Kafka = require('./src/index');

const consumer = new Kafka.consumer();
const producer = new Kafka.producer();

function consumerEvent(con) {
  return new Promise((resolve, reject) => {
    con.message()
      .subscribe((data) => {
        resolve(data);
        console.log('Consumer Data:', data);
      });
    con.error()
      .subscribe((err) => {
        reject(err);
        console.log('Consumer Error:', err);
      });
    con.log('Producer Connected');
  });
}

function producerEvent(pro) {
  return new Promise((resolve, reject) => {
    pro.report()
      .subscribe((report) => {
        console.log('Producer Delivery Report:', report);
        return resolve(report);
      });
    pro.error()
      .subscribe((err) => {
        console.log('Producer Error:', err);
        return reject(err);
      });
    console.log('Producer Connected');
    const message = {
      foo: 1,
      bar: 2
    };
    producer.publish(JSON.stringify(message));
  });
}

Promise.all([consumer.connect(), producer.connect()])
  .then(() => {
    const message = {
      foo: 1,
      bar: 2
    };
    producer.publish(JSON.stringify(message));

    return Promise.all([consumerEvent(consumer), producerEvent(producer)]);
  })
  .then((data) => {
    console.log('DATA', data);
    return Promise.all([consumer.disconnect(), producer.disconnect()]);
  })
  .catch((err) => {
    console.error('Error', err);
  });