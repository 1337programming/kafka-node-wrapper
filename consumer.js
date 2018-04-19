const Kafka = require('node-rdkafka'); // Kafka Node SDK
const ENV = require('dotenv').config().parsed; // Environment
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const Client = require('./client');

/**
 * Kafka Consumer
 * @param {TopicConfig} topicConfig - the Kafka Topic Configuration
 */
class Consumer extends Client {

  constructor(topicConfig = null) {
    super();
    this._messageDispatcher = new Subject();
    // _counter to commit offsets every _numMessages are received
    this._counter = 0;
    this._numMessages = 5;
    this._kafkaConsumer = new Kafka.KafkaConsumer({
      // debug: 'all',
      'group.id': 'kafka',
      'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
      'enable.auto.commit': true
    }, topicConfig);
    this._initEvent();
  }

  /**
   * Connect to Kafka
   * @return {Promise<void>}
   */
  connect() {
    return super.connect(this._kafkaConsumer)
      .then(() => {
        this._kafkaConsumer.subscribe([ENV.Topic1Name]);
        // start consuming messages
        this._kafkaConsumer.consume((err, message) => {
          if (err) {
            console.log(err);
          } else {
            console.log(message);
          }
        });
      });
  }

  consumeInterval(ms) {
    setInterval(() => {
      console.log('LAWL');
      this._kafkaConsumer.consume((err, message) => {
        if (err) {
          console.log(err);
        } else {
          console.log(message);
        }
      });
    }, ms);
  }

  /**
   * Disconnect from Kafka
   * @return {Promise<void>}
   */
  disconnect() {
    return super.disconnect(this._kafkaConsumer);
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
   */
  _initEvent() {

    super.initEvent(this._kafkaConsumer);

    // Listen to all messages
    this._kafkaConsumer.on('data', (m) => {
      this._counter++;

      // Reset Counter
      if (this._counter === 100000) {
        this._counter = 0;
      }

      this._kafkaConsumer.commit(m);

      // committing offsets every _numMessages
      if (this._counter % this._numMessages === 0) {
        console.log('Commit Operation:', new Date(), 'Committing...');
        this._kafkaConsumer.commit(m);
      }

      // Output the actual message contents
      // @TODO remove this after test
      console.log(JSON.stringify(m));
      console.log(m.value.toString());

      this._messageDispatcher.next(m.value.toString());

    });
  }

}

module.exports = Consumer;
