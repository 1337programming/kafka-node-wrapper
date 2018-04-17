const assert = require('assert');
const expect = require("chai").expect;

const KafkaCentene = require('./index');

describe('Kafka Centene Test', () => {

  const producer = new KafkaCentene.producer();
  const consumer = new KafkaCentene.consumer();

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