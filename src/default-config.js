const ENV = require('dotenv').config().parsed; // Environment from docker .ENV

/**
 * KafkaConfig
 */
module.exports = {
  DEFAULT_CONSUMER_CONFIG: {
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
  DEFAULT_PRODUCER_CONFIG: {
    client: {
      // debug: 'all',
      'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
      'dr_cb': true // delivery report callback
    },
    topics: [ENV.Topic1Name],
    throttle: ENV.Throttle,
    autoInterval: true
  },
  KAFKA_EVENTS: [
    'disconnected',
    'ready',
    'event',
    'event.log',
    'event.stats',
    'event.error',
    'event.throttle',
    'delivery-report',
    'data'
  ]
};
