const {KafkaConsumer} = require('node-rdkafka'); // Kafka Node SDK
const {Subject} = require('rxjs'); // Reactive Extension (helps us structure events)
const KafkaClient = require('./client');
const {DEFAULT_CONSUMER_CONFIG} = require('./default-config');

/**
 * Kafka Consumer
 * @param {ConsumerConfig} [conf=DEFAULT_CONSUMER_CONFIG] - defaults to default config
 * @param {TopicConfig} [topicConfig=null] - the Kafka Topic Configuration
 */
class Consumer extends KafkaClient {

  /**
   * Kafka Consumer
   * @param {ConsumerConfig} [conf=DEFAULT_CONSUMER_CONFIG] - defaults to default config
   * @param {TopicConfig} [topicConfig=null] - the Kafka Topic Configuration
   */
  constructor(conf = DEFAULT_CONSUMER_CONFIG, topicConfig = null) {
    super();

    this._config = Object.assign(DEFAULT_CONSUMER_CONFIG, conf); // Ensures defaults

    this._consumeLoop = null;
    this._messageDispatcher = new Subject();
    this.kafkaConsumer = new KafkaConsumer(this._config.client, topicConfig);
    this._initEvent();
  }

  /**
   * Connect to Kafka
   * @Override
   * @return {Promise<void>}
   */
  connect() {
    return super.connectClient(this.kafkaConsumer)
      .then((args) => {
        console.log('Consumer Connection Args', args);

        this.kafkaConsumer.subscribe(this._config.topics);
        if (this._config.autoInterval) {
          this._consume();
        }
      });
  }

  /**
   * Disconnect from Kafka
   * @return {Promise<void>}
   */
  disconnect() {
    clearInterval(this._consumeLoop);
    return super.disconnectClient(this.kafkaConsumer);
  }

  /**
   * Message stream to listen to
   * @return {Observable<T>} - message stream
   */
  onMessage() {
    return this._messageDispatcher.asObservable();
  }

  /**
   * Consume message
   * @param {number} [limit = this._config.consumeMax] - limit or number of messages to consume
   */
  consume(limit = this._config.consumeMax) {
    this.kafkaConsumer.consume(limit);
  }

  /**
   * Manual Commit
   * @param {string} [topicPartition] - topic partition to commit
   */
  commit(topicPartition) {
    this.kafkaConsumer.commit(topicPartition);
  }

  /**
   * Initializes the events
   * @private
   * @return {void}
   */
  _initEvent() {

    super.initEventLogs(this.kafkaConsumer);

    // Listen to all messages
    this.kafkaConsumer.on('data', (message) => {
      if (this._config.autoInterval) {
        clearInterval(this._consumeLoop);
      }

      this.kafkaConsumer.commit();

      // Output the actual message contents
      // @TODO remove this after test
      console.log(JSON.stringify(message));
      console.log(message.value.toString());
      try {
        message.value = JSON.parse(message.value.toString());
      } catch (err) {
        // Ignore error
        console.error('Failed to parse message', err);
      }
      this._messageDispatcher.next(message);

    });
  }

  /**
   * Consume event
   * @private
   */
  _consume() {
    this._consumeLoop = setInterval(() => {
      // start consuming messages
      this.kafkaConsumer.consume(this._config.consumeMax);
    }, this._config.throttle);
  }

}

module.exports = Consumer;
