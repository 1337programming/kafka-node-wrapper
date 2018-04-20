const KafkaConsumer = require('node-rdkafka').KafkaConsumer; // Kafka Node SDK
const ENV = require('dotenv').config().parsed; // Environment
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const KafkaClient = require('./client');
const DEFAULT_CONFIG = require('./default-config').consumer;

/**
 * Kafka Consumer
 * @param {TopicConfig} topicConfig - the Kafka Topic Configuration
 */
class Consumer extends KafkaClient {

  constructor(conf = DEFAULT_CONFIG, topicConfig = null) {
    super();

    this._consumeLoop = null;
    this._messageDispatcher = new Subject();
    // _counter to commit offsets every _numMessages are received
    this._counter = 0;
    this._numMessages = 5;
    this.kafkaConsumer = new KafkaConsumer(conf, topicConfig);
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

        this.kafkaConsumer.subscribe([ENV.Topic1Name]);

        this._consume();
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
   * Initializes the events
   * @private
   * @return {void}
   */
  _initEvent() {

    super.initEventLogs(this.kafkaConsumer);

    // Listen to all messages
    this.kafkaConsumer.on('data', (message) => {
      clearInterval(this._consumeLoop);

      this._commit(message);

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
      this.kafkaConsumer.consume(1);
    }, ENV.Throttle);
  }

  _commit(message) {

    // this._counter++;
    //
    // // Reset Counter
    // if (this._counter === 100000) {
    //   this._counter = 0;
    // }

    this.kafkaConsumer.commit(message);

    // // committing offsets every _numMessages
    // if (this._counter % this._numMessages === 0) {
    //   console.log('Commit Operation:', new Date(), 'Committing...');
    //   this.kafkaConsumer.commit(m);
    // }

  }

}

module.exports = Consumer;
