const KafkaConsumer = require('node-rdkafka').KafkaConsumer; // Kafka Node SDK
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const KafkaClient = require('./client');
const DEFAULT_CONFIG = require('./default-config').consumer;

/**
 * Kafka Consumer
 * @param {ConsumerConfig} conf - defaults to default config
 * @param {TopicConfig} topicConfig - the Kafka Topic Configuration
 */
class Consumer extends KafkaClient {

  constructor(conf = DEFAULT_CONFIG, topicConfig = null) {
    super();

    Object.assign(DEFAULT_CONFIG, conf); // Ensures defaults

    this._config = conf;
    this._consumeLoop = null;
    this._messageDispatcher = new Subject();
    this.kafkaConsumer = new KafkaConsumer(conf.client, topicConfig);
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
  message() {
    return this._messageDispatcher.asObservable();
  }

  /**
   * Consume message
   * @param {number} limit - limit or number of messages to consume
   */
  consume(limit = this._config.consumeMax) {
    this.kafkaConsumer.consume(limit);
  }

  /**
   * Manual Commit
   * @optional @param {string=} topicPartition - topic partition to commit
   */
  commit(topicPartition) {
    this.kafkaConsumer.commit(topicPartition)
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
      this._messageDispatcher.next(message.value.toString());

    });
  }

  _consume() {
    this._consumeLoop = setInterval(() => {
      // start consuming messages
      this.kafkaConsumer.consume(this._config.consumeMax);
    }, this._config.throttle);
  }

}

module.exports = Consumer;
