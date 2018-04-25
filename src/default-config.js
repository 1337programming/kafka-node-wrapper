const ENV = require('dotenv').config().parsed; // Environment from docker .ENV

/**
 * KafkaConfig
 */
module.exports = {
  consumer: {
    client: {
      // debug: 'all',
      'group.id': 'kafka',
      'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
      'enable.auto.commit': false
    },
    topics: [ENV.Topic1Name],
    throttle: ENV.Throttle,
    autoInterval: true,
    consumeMax: 1
  },
  producer: {
    client: {
      // debug: 'all',
      'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
      'dr_cb': true, // delivery report callback
    },
    topics: [ENV.Topic1Name],
    throttle: ENV.Throttle,
    autoInterval: true
  },

};
