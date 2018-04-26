const {Subject} = require('rxjs');
const {KAFKA_EVENTS} = require('./default-config');

/**
 * Kafka Client base class
 */
class KafkaClient {

  /**
   * Creates events
   */
  constructor() {
    this._connected = false;
    this._logDispatcher = new Subject();
    this._errorDispatcher = new Subject();
  }

  /**
   * Listen to log stream
   * @return {Observable<log>} - log message
   */
  log() {
    return this._logDispatcher.asObservable();
  }

  /**
   * Listen to error stream
   * @return {Observable<Error>}
   */
  error() {
    return this._errorDispatcher.asObservable();
  }

  /**
   * Connect to Kafka
   * @protected
   * @param {KafkaConsumer | Producer | Client | Consumer} kafkaClient - the kafka client (either Kafka Consumer or
   * Producer
   * @return {Promise<T>} - arguments from Kafka
   */
  connectClient(kafkaClient) {
    this._check(kafkaClient);
    return new Promise((resolve, reject) => {
      kafkaClient
        .connect(null, (data) => {
          console.log('Connection', data);
        })
        .on('event.error', (error) => {
          console.error('Connect Operation (Error)', `${new Date()}:  Error: ${error}`);
          this._errorDispatcher.next(error);
          return reject(error);
        })
        .on('ready', (args) => {
          console.log('Connect Operation', `${new Date()}: Consumer Ready. Args: ${JSON.stringify(args)}`);
          this._connected = true;
          return resolve(args);
        });
    });
  }

  /**
   * Disconnect from Kafka
   * @protected
   * @param {KafkaConsumer | Producer | Client | Consumer} kafkaClient - the kafka client (either Kafka Consumer or
   * Producer
   * @return {Promise<void>}
   */
  disconnectClient(kafkaClient) {
    this._check(kafkaClient);
    if (!this._connected) {
      throw new Error('Client is already disconnected.');
    }
    return new Promise(
      (resolve, reject) => {
        kafkaClient.disconnect();

        kafkaClient.prependListener('event.error', (err) => {
          console.error('Disconnect Operation (Error)', `${new Date()}: Error:`, err);
          this._errorDispatcher.next(err);
          return reject(err);
        });

        kafkaClient.on('disconnected', (arg) => {
          console.log('Disconnect Operation', `${new Date()}: Client Disconnected: ${JSON.stringify(arg)}`);
          return resolve();
        });
      })
      .then(() => {
        KAFKA_EVENTS.forEach((event) => {
          kafkaClient.removeAllListeners(event);
        });
        this._connected = false;
      });
  }

  /**
   * Initializes the events
   * @protected
   * @param {KafkaConsumer | Producer | Client | Consumer} kafkaClient - the kafka client (either Kafka Consumer or
   * Producer
   * @return {void}
   */
  initEventLogs(kafkaClient) {
    this._check(kafkaClient);
    // logging debug messages, if debug is enabled
    kafkaClient.on('event.log', (log) => {
      console.log('Event Log', new Date(), log);
      this._logDispatcher.next(log);
    });

    // logging all errors
    kafkaClient.on('event.error', (err) => {
      console.error(`Error Log: ${new Date()}:`, err);
      this._errorDispatcher.next(err);
    });
  }

  /**
   * Emit error
   * @protected
   * @param {Error} err - Error to emit
   * @return {void}
   */
  emitError(err) {
    this._errorDispatcher.next(err);
  }

  /**
   * Checks if values are set
   * @private
   * @param {KafkaConsumer | Producer | Client | Consumer} kafkaClient - the kafka client (either Kafka Consumer or
   * Producer
   * @return {void}
   */
  _check(kafkaClient) {
    if (!kafkaClient || !this._logDispatcher || !this._errorDispatcher) {
      throw new Error('Client hasn\'t been set. Make sure to instantiate the class ' +
        '"new Consumer(options)" or "new Producer(options)"');
    }
  }

}

module.exports = KafkaClient;
