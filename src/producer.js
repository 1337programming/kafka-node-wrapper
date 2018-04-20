const KafkaProducer = require('node-rdkafka').Producer; // Kafka Node SDK
const ENV = require('dotenv').config().parsed; // Environment
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const KafkaClient = require('./client');
const DEFAULT_CONFIG = require('./default-config').producer;

/**
 * Kafka Consumer for
 * @param {TopicConfig} topicConfig - the Kafka Topic Configuration
 */
class Producer extends KafkaClient {


  constructor(conf = DEFAULT_CONFIG, topicConfig = null) {
    super();

    this._pollLoop = null;
    this._deliveryReportDispatcher = new Subject();

    this.kafkaProducer = new KafkaProducer(conf, topicConfig);

    this._initEvent();
  }

  /**
   * Connect to Kafka
   * @return {Promise<void>}
   */
  connect() {
    return super.connectClient(this.kafkaProducer)
      .then((args) => {
        console.log('Producer Connection Args', new Date(), args);
        this._pollLoop = setInterval(() => {
          this.kafkaProducer.poll();
        }, ENV.Throttle);
      })
  }

  /**
   * Disconnect from Kafka
   * @return {Promise<void>}
   */
  disconnect() {
    clearInterval(this._pollLoop);
    return super.disconnectClient(this.kafkaProducer);
  }

  /**
   * Publish a message
   * @param {String} message - message to send
   * @param {Number} partition - optionally  specify a partition for the message, this defaults to -1 - which will
   *  use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
   * @param {String} key - keyed message (optional)
   * @param {String} opaque - opaque token which gets passed along to your delivery reports
   * @return {void}
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
    } catch (err) {
      console.error('Producer Operation (Error)', new Date(), err);
      super.emitError(err);
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
   * @return {void}
   */
  _initEvent() {

    super.initEventLogs(this.kafkaProducer);

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
