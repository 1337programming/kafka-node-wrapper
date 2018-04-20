const assert = require('assert');
const expect = require('chai').expect;

const Kafka = require('./src/index');

describe('Kafka  Test', () => {

  const producer = new Kafka.producer();
  const consumer = new Kafka.consumer();

  describe('Consumer', () => {

    it('Connect & Disconnect', () => {
      return Promise.all([producer.connect(), consumer.connect()])
        .then(() => {
          return Promise.all([producer.disconnect(), consumer.disconnect()]);
        })
        .then(() => {
          return 'Success';
        })
        .catch((err) => {
          console.error('Error', err);
          throw new Error(err);
        })
    });

    it('Pub Sub', () => {
      let store;
      return Promise.all([producer.connect(), consumer.connect()])
        .then(() => {
          console.log('Client and Producer Connected');
          consumer.message()
            .subscribe((data) => {
              store = data;
              console.log('Data', data);
            }, (err) => {
              console.error('Client Message Subscribe Error', err);
            });
          consumer.error()
            .subscribe((err) => {
              console.log('Client Error', err);
            }, (err) => {
              console.error('Client Error Subscribe Error', err);
            });
          producer.error()
            .subscribe((err) => {
              console.log('Producer Error:', err);
            });
          producer.report()
            .subscribe((report) => {
              console.log('Producer Delivery Report:', report);
            });
          const message = {
            foo: 1,
            bar: 2
          };
          producer.publish(JSON.stringify(message));
          expect(store).to.equal('balls');
        })
        .catch((err) => {
          console.error('Error', err);
        });
    });
  });
});