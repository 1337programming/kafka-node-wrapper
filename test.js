const assert = require('assert');
const expect = require('chai').expect;
const sample = require('./sample');

const Kafka = require('./src/index');


describe('Kafka  Test', () => {

  const producer = new Kafka.producer();
  const consumer = new Kafka.consumer();

  describe('Consumer', () => {

    /*it('Connect & Disconnect', () => {
      return Promise.all([producer.connect(), consumer.connect()])
        .then(() => {
          return Promise.all([producer.disconnect(), consumer.disconnect()]);
        })
        .then(() => {
          return 'Success';
        })
        .catch((err) => {
          console.error('TEST Error', err);
          throw new Error(err);
        })
    });*/

    it('Pub Sub', () => {
      let message;
      return Promise.all([producer.connect(), consumer.connect()])
        .then(() => {
          return Promise.all([sample.consumerEvent(consumer), sample.producerEvent(producer)]);
        })
        .then((data) => {
          console.log('DATA', data);
          expect(JSON.parse(data[0])).to.equal(message);
          return Promise.all([consumer.disconnect(), producer.disconnect()]);
        })
        .then(() => {
          console.log('Disconnected');
        })
        .catch((err) => {
          console.error('Error', err);
        });
    });
  });
});