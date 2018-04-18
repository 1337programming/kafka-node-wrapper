const assert = require('assert');
const expect = require("chai").expect;

const Kafka = require('./index');

describe('Kafka  Test', () => {

  const producer = new Kafka.producer();
  const consumer = new Kafka.consumer();

  describe('Consumer', () => {
    it('Connect', (done) => {
      consumer.connect()
        .then(() => {
          done();
        })
        .catch((err) => {
          console.error(err);
        })
    });
  });
});