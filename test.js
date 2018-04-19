const assert = require('assert');
const expect = require('chai').expect;

const Kafka = require('./index');

describe('Kafka  Test', () => {

  const producer = new Kafka.producer();
  const consumer = new Kafka.consumer();

  describe('Consumer', () => {
    it('Connect', (done) => {
      consumer.connect()
        .then(() => {
          console.log('Client Connected');
          consumer.message()
            .subscribe((data) => {
              done();
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
          consumer.consumeInterval(100);
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
    });
  });
});