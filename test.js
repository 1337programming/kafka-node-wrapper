const {expect} = require('chai');
const {consumer, producer, consumerEvent, producerEvent} = require('./sample');

describe('Kafka  Test', () => {

  describe('Consumer', () => {

    beforeEach(() => {
      return Promise.all([producer.connect(), consumer.connect()]);
    });

    afterEach(() => {
      return Promise.all([producer.disconnect(), consumer.disconnect()]);
    });

    it('Pub Sub', () => {
      let message = {foo: 1, bar: 2};
      return Promise.all([consumerEvent(consumer), producerEvent(producer, message)])
        .then((data) => {
          console.log('DATA', data);
          expect(data[0]).to.equal(JSON.stringify(message));
        })
        .catch((err) => {
          console.error('Error', err);
        });
    });
  });
});