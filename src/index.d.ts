import { Observable } from 'rxjs/Observable';
import * as Kafka from 'node-rdkafka';

export interface Log {
  fac: string;
  message: string;
  severity: number;
}

export interface TopicConfig {

}

export interface MessagePayload {

}

export interface DirectReport {

}

/**
 * Kafka Client base class
 */
export abstract class Client {

  constructor() {
  }

  public log(): Observable<Log>;

  public error(): Observable<Error>;

  public connect(kafkaClient: Kafka.Client): Promise<void>;

  public disconnect(kafkaClient: Kafka.Client): Promise<void>;

  protected initEvent(kafkaClient: Kafka.Client): void;

  protected emitError(err: Error): void;

  private _check(kafkaClient: Kafka.Client): void;
}

export class Consumer extends Client {

  public kafkaConsumer: Kafka.KafkaConsumer;

  constructor(topicConfig?: TopicConfig);

  public message(): Observable<MessagePayload>;

}

export class Producer extends Client {

  public kafkaProducer: Kafka.Producer;

  constructor(topicConfig: TopicConfig);

  public connect(): Promise<void>;

  public disconnect(): Promise<void>;

  public publish(message: string, partition: number, key: string, opaque: string): Promise<void>;

  public report(): Observable<DirectReport>;

  private _initEvent(): void;
}

export interface KafkaWrapper {
  consumer: Consumer;
  producer: Producer;
}