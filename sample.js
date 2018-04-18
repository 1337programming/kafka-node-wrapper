const Kafka = require('./index');

const consumer = new Kafka.consumer();
const producer = new Kafka.producer();

consumer.connect()
  .then(() => {
    console.log('Client Connected');
    consumer.message()
      .subscribe((data) => {
        console.log('Data', data);
      }, (err) => {
        console.error('Client Message Subscribe Error', err);
      });
    consumer.error()
      .subscribe((err) => {
        console.log(err);
      }, (err) => {
        console.error('Client Error Subscribe Error', err);
      });
    return producer.connect()
  })
  .then(() => {
    console.log('Producer Connected');
    const message = {
      foo: 1,
      bar: 2
    };
    return producer.publish(JSON.stringify(message))
  })
  .then(() => {
    console.log('Publish done');
  })
  .catch((err) => {
    console.error('Error', err);
  });
