import { Observable } from 'rxjs/Observable';
import * as Kafka from 'node-rdkafka';

export interface Log {
  fac: string;
  message: string;
  severity: number;
}

export interface Config {
  'metadata.broker.list'?: string;
  'security.protocol'?: string;
  'enable.auto.commit'?: boolean;
  'sasl.mechanisms'?: string;
  'sasl.username'?: string;
  'sasl.password'?: string;
  'ssl.ca.location'?: string;
}

export interface ConsumerConfig extends Config {
  'group.id'?: string
  offset_commit_cb?: (err: Error, topicPartitions: any) => any;
  rebalance_cb?: (err: Error, assignment: any) => any;
}

export interface TopicConfig extends Config {
  'client.id': string;
  'compression.codec': string | 'gzip' | 'snappy' | 'none';
  'retry.backoff.ms': number;
  'message.send.max.retries': number;
  'socket.keepalive.enable': boolean;
  'queue.buffering.max.messages': number;
  'queue.buffering.max.ms': number;
  'batch.num.messages': number;
  dr_cb: boolean;
  dr_msg_cb: boolean;
}

export interface MessagePayload {
  value: Buffer; // message contents as a Buffer
  size: number; // size of the message, in bytes
  topic: string; // topic the message comes from
  offset: number; // offset the message was read from
  partition: number; // partition the message was on
  key: string; // key of the message if present
  timestamp: number; // timestamp of message creation
}

export interface DirectReport {

}

export type KafkaClient = Kafka.Client | Kafka.KafkaConsumer | Kafka.Producer;

/**
 * Kafka Client base class
 */
export abstract class Client {

  constructor();

  public log(): Observable<Log>;

  public error(): Observable<Error>;

  protected connectClient(kafkaClient?: KafkaClient): Promise<{ name: string }>;

  protected disconnectClient(kafkaClient?: KafkaClient): Promise<void>;

  protected initEventLogs(kafkaClient: KafkaClient): void;

  protected emitError(err: Error): void;

  private _check(kafkaClient: KafkaClient): void;
}

export class Consumer extends Client {

  public kafkaConsumer: Kafka.KafkaConsumer;

  constructor(topicConfig?: TopicConfig);

  public message(): Observable<MessagePayload>;

  public connect(): Promise<{ name: string }>;

  public disconnect(): Promise<void>;

  private _initEvent(): void;

}

export class Producer extends Client {

  public kafkaProducer: Kafka.Producer;

  constructor(topicConfig: TopicConfig);

  public publish(message: string, partition?: number, key?: string, opaque?: string): void;

  public report(): Observable<DirectReport>;

  public connect(): Promise<{ name: string }>;

  public disconnect(): Promise<void>;

  private _initEvent(): void;
}

export interface KafkaWrapper {
  consumer: Consumer;
  producer: Producer;
}