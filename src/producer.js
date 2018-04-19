const Kafka = require('node-rdkafka'); // Kafka Node SDK
const ENV = require('dotenv').config().parsed; // Environment
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const Client = require('./client');

/**
 * Kafka Consumer for
 * @param {TopicConfig} topicConfig - the Kafka Topic Configuration
 */
class Producer extends Client {

  constructor(topicConfig = null) {
    super();

    this._deliveryReportDispatcher = new Subject();

    this.kafkaProducer = new Kafka.Producer({
      // debug: 'all',
      'metadata.broker.list': `${ENV.KafkaIP}:${ENV.KafkaPort}`,
      'dr_cb': true  // delivery report callback
    }, topicConfig);

    this._initEvent();
  }

  /**
   * Connect to Kafka
   * @return {Promise<void>}
   */
  connect() {
    return super.connect(this.kafkaProducer)
      .then(() => {

      })
  }

  /**
   * Disconnect from Kafka
   * @return {Promise<void>}
   */
  disconnect() {
    return super.disconnect(this.kafkaProducer);
  }

  /**
   * Publish a message
   * @param {String} message - message to send
   * @param {Number} partition - optionally  specify a partition for the message, this defaults to -1 - which will
   *  use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
   * @param {String} key - keyed message (optional)
   * @param {String} opaque - opaque token which gets passed along to your delivery reports
   * @return {Promise<void>}
   * // @TODO fix and review with Prasana
   */
  publish(message, partition = -1, key = null, opaque = null) {
    try {
      this.kafkaProducer.produce(
        ENV.Topic1Name,
        partition,
        new Buffer.from(message),
        key,
        Date.now(),
        opaque
      );
      this.kafkaProducer.poll();
      return Promise.resolve();
    } catch (err) {
      console.error('Producer Operation (Error)', new Date(), err);
      super.emitError(err);
      return Promise.reject();
    }
  }

  /**
   * Stream delivery report from the kafka producer
   * @return {Observable<T>}
   */
  report() {
    return this._deliveryReportDispatcher.asObservable();
  }


  /**
   * Initializes the events
   * @private
   */
  _initEvent() {

    super.initEvent(this.kafkaProducer);

    this.kafkaProducer.on('delivery-report', (err, report) => {
      if (err) {
        this.emitError(err);
      }
      console.log('Delivery Report Operation:', new Date(), report);
      this._deliveryReportDispatcher.next(report);
    });

  }

}

module.exports = Producer;
