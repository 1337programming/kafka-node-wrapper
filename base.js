const Subject = require('rxjs').Subject;

/**
 * Kafka Base
 */
class Base {

  constructor() {
    this._logDispatcher = new Subject();
    this._errorDispatcher = new Subject();
  }

  /**
   * Listen to log stream
   * @returns {Observable<log>} - log message
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
   */
  connect(kafkaClient) {
    this._check();
    return new Promise((resolve, reject) => {
      kafkaClient.connect()
        .on('event.error', (error) => {
          console.error('Connect Operation (Error)', `${new Date()}:  Error: ${error}`);
          this._errorDispatcher.next(error);
          return reject(error);
        })
        .on('ready', () => {
          console.log('Connect Operation', `${new Date()}: Consumer Ready. Args: ${JSON.stringify(arg)}`);
          return resolve();
        });
    });
  }

  /**
   * Disconnect from Kafka
   * @protected
   */
  disconnect(kafkaClient) {
    return new Promise((resolve, reject) => {
      kafkaClient.disconnect()
        .on('event.error', (err) => {
          console.error('Disconnect Operation (Error)', `${new Date()}: Error:`, err);
          this._errorDispatcher.next(err);
          return reject(err);
        })
        .on('disconnected', (arg) => {
          console.log('Disconnect Operation', `${new Date()}: Consumer Disconnected: ${JSON.stringify(arg)}`);
          return resolve();
        });
    });
  }

  /**
   * Initializes the events
   * @protected
   */
  initEvent(kafkaClient) {
    this._check();
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
   * @param err - Error to emit
   */
  emitError(err) {
    this._errorDispatcher.next(err);
  }

  /**
   * Checks if values are set
   * @private
   */
  _check(kafkaClient) {
    if (!kafkaClient && !this._logDispatcher && !this._errorDispatcher) {
      throw new Error('Client hasn\'t been set. Make sure to instantiate the class ' +
        '"new Consumer(options)" or "new Producer(options)"');
    }
  }

}

module.exports = Base;
