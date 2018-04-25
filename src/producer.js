const KafkaProducer = require('node-rdkafka').Producer; // Kafka Node SDK
const Subject = require('rxjs').Subject; // Reactive Extension (helps us structure events)
const toPromise = require('rxjs/operator/toPromise');
const KafkaClient = require('./client');
const DEFAULT_CONFIG = require('./default-config').producer;

/**
 * Kafka Producer
 * @param {ProducerConfig} conf - defaults to default config
 * @param {Config} topicConfig - the Kafka Topic Configuration
 */
class Producer extends KafkaClient {

  constructor(conf = DEFAULT_CONFIG, topicConfig = null) {
    super();

    Object.assign(DEFAULT_CONFIG, conf); // Ensures defaults

    this.config = conf;
    this._pollLoop = null;
    this._deliveryReportDispatcher = new Subject();
    this.kafkaProducer = new KafkaProducer(conf.client, topicConfig);
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
        }, this.config.throttle);
      });
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
   * @param {String} topic - topic to send to
   * @param {number} partition - optionally  specify a partition for the message, this defaults to -1 - which will
   *  use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
   * @param {String} key - keyed message (optional)
   * @param {String} opaque - opaque token which gets passed along to your delivery reports
   * @return {Promise<DeliveryReport>}
   */
  publish(message, topic = DEFAULT_CONFIG.topics[0], partition = -1, key = null, opaque = null) {
    try {
      this.kafkaProducer.produce(
        topic,
        partition,
        new Buffer.from(message),
        key,
        Date.now(),
        opaque
      );

      return this._deliveryReportDispatcher.asObservable() // Convert Observable to Promise
        .pipe(toPromise());

    } catch (err) {
      console.error('Producer Operation (Error)', new Date(), err);
      super.emitError(err);
      return reject(err);
    }
  }

  /**
   * Stream delivery report from the kafka producer
   * @return {Observable<DeliveryReport>}
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
        super.emitError(err);
      }
      console.log('Delivery Report Operation:', new Date(), report);
      this._deliveryReportDispatcher.next(report);
    });

  }

}

module.exports = Producer;
