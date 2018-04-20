const ENV = require('dotenv').config().parsed; // Environment

module.exports = {
  consumer: {
    // debug: 'all',
    'group.id': 'kafka',
    'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
    'enable.auto.commit': true
  },
  producer: {
    // debug: 'all',
    'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
    'dr_cb': true  // delivery report callback
  }
};
