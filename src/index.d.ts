import { Observable } from 'rxjs/Observable';
import * as Kafka from 'node-rdkafka';

export interface Log {
  fac: string;
  message: string;
  severity: number;
}

/**
 * Custom configuration for this wrapper
 */
export interface Config {
  topics?: string[];
  throttle?: number;
  autoInterval?: boolean;
  client?: KafkaConfig
}

export interface ConsumerConfig extends Config {
  consumeMax?: number;
  client?: KafkaConsumerConfig;
}

export interface ProducerConfig extends Config {
  client?: KafkaProducerConfig;
}

/**
 * Configuration from rdkafka
 */
export interface KafkaConfig {
  'builtin.features'?: string; // gzip, snappy, ssl, sasl, regex, lz4, sasl_gssapi, sasl_plain, sasl_scram, plugins
  'client.id'?: string;
  'metadata.broker.list'?: string;
  'bootstrap.servers'?: string;
  'message.max.bytes'?: number;
  'message.copy.max.bytes'?: number;
  'receive.message.max.bytes'?: number;
  'max.in.flight.requests.per.connection'?: number;
  'max.in.flight'?: number;
  'metadata.request.timeout.ms'?: number;
  'topic.metadata.refresh.interval.ms'?: number;
  'metadata.max.age.ms'?: number;
  'topic.metadata.refresh.fast.interval.ms'?: number;
  'topic.metadata.refresh.fast.cnt'?: number;
  'topic.metadata.refresh.sparse'?: number;
  'topic.blacklist'?: string[];
  'debug'?: string;
  'socket.timeout.ms'?: number;
  'socket.blocking.max.ms'?: number;
  'socket.send.buffer.bytes'?: number;
  'socket.receive.buffer.bytes'?: number;
  'socket.keepalive.enable'?: boolean;
  'socket.nagle.disable'?: boolean;
  'socket.max.fails'?: number;
  'broker.address.ttl'?: number;
  'broker.address.family'?: 'any' | 'v4' | 'v6';
  'reconnect.backoff.jitter.ms'?: number;
  'statistics.interval.ms'?: number;
  enabled_events?: number;
  error_cb?: Function;
  throttle_cb?: Function;
  stats_cb?: Function;
  log_cb?: Function;
  log_level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  'log.queue'?: boolean;
  'log.thread.name'?: boolean;
  'log.connection.close'?: boolean;
  socket_cb?: Function;
  connect_cb?: Function;
  closesocket_cb?: Function;
  open_cb?: Function;
  'opaque'?: any;
  default_topic_conf?: any;
  'internal.termination.signal'?: number;
  'api.version.request.timeout.ms'?: number;
  'api.version.fallback.ms'?: number;
  'broker.version.fallback'?: string;
  'security.protocol'?: 'plaintext' | 'ssl' | 'sasl_plaintext' | 'sasl_ssl';
  'ssl.cipher.suites'?: string;
  'ssl.key.location'?: string;
  'ssl.key.password'?: string;
  'ssl.certificate.location'?: string;
  'ssl.ca.location'?: string;
  'ssl.crl.location'?: string;
  'sasl.mechanisms'?: 'GSSAPI' | 'PLAIN' | 'SCRAM-SHA-256' | 'SCRAM-SHA-512'
  'sasl.kerberos.service.name'?: string;
  'sasl.kerberos.principal'?: string;
  'sasl.kerberos.kinit.cmd'?: string;
  'sasl.kerberos.keytab'?: string;
  'sasl.kerberos.min.time.before.relogin'?: number;
  'sasl.username'?: string;
  'sasl.password'?: string;
  'plugin.library.paths'?: string;
  interceptors?: any;
  'group.id'?: string;
  'partition.assignment.strategy'?: string;
  'session.timeout.ms'?: number;
  'heartbeat.interval.ms'?: number;
  'group.protocol.type'?: string;
  'coordinator.query.interval.ms'?: number;
  'queue.buffering.max.messages'?: number;
}

export interface KafkaConsumerConfig extends KafkaConfig {
  'enable.auto.commit'?: boolean;
  'auto.commit.interval.ms'?: number;
  'enable.auto.offset.store'?: number;
  'queued.min.messages'?: number;
  'queued.max.messages.kbytes'?: number;
  'fetch.wait.max.ms'?: number;
  'fetch.message.max.bytes'?: number;
  'max.partition.fetch.bytes'?: number;
  'fetch.min.bytes'?: number;
  'fetch.error.backoff.ms'?: number;
  'offset.store.method'?: 'none' | 'file' | 'broker';
  consume_cb?: Function;
  rebalance_cb?: Function;
  offset_commit_cb?: Function;
  'enable.partition.eof'?: boolean;
  'check.crcs'?: boolean;
}

export interface KafkaProducerConfig extends KafkaConfig {
  'queue.buffering.max.kbytes'?: number;
  'queue.buffering.max.ms'?: number;
  'linger.ms'?: number;
  'message.send.max.retries'?: number;
  retries?: number;
  'retry.backoff.ms'?: number;
  'compression.codec'?: 'none' | 'gzip' | 'snappy' | 'lz4';
  'batch.num.messages'?: number;
  'delivery.report.only.error'?: boolean;
  dr_cb?: Function;
  dr_msg_cb?: Function;
}

export interface TopicConfig {
  'request.required.acks'?: number;
  acks?: number;
  'request.timeout.ms'?: number;
  'message.timeout.ms'?: number;
  'produce.offset.report'?: boolean;
  partitioner_cb?: Function;
  opaque?: Function;
  'compression.codec'?: 'none' | 'gzip' | 'snappy' | 'lz4' | 'inherit';
  'auto.commit.enable'?: boolean;
  'enable.auto.commit'?: boolean;
  'auto.commit.interval.ms'?: number;
  'auto.offset.reset'?: 'smallest' | 'earliest' | 'beginning' | 'largest' | 'latest' | 'end' | 'error';
  'offset.store.path'?: string;
  'offset.store.sync.interval.ms'?: number;
  'offset.store.method'?: 'file' | 'broker';
  'consume.callback.max.messages'?: number;
}

export interface MessagePayload<Type> {
  value: Type; // message contents
  size: number; // size of the message, in bytes
  topic: string; // topic the message comes from
  offset: number; // offset the message was read from
  partition: number; // partition the message was on
  key: string; // key of the message if present
  timestamp: number; // timestamp of message creation
}

export interface DeliveryReport {
  topic: string;
  partition: number;
  offset: number;
  key: string;
  opaque: string;
  size: number;

}

export type KafkaClient = Kafka.Client | Kafka.KafkaConsumer | Kafka.Producer;

/**
 * Kafka Client base class
 */
export abstract class Client {

  constructor();

  public onLog(): Observable<Log>;

  public onError(): Observable<Error>;

  public onDisconnected(): Observable<void>;

  protected connectClient(kafkaClient?: KafkaClient): Promise<{ name: string }>;

  protected disconnectClient(kafkaClient?: KafkaClient): Promise<void>;

  protected initEventLogs(kafkaClient: KafkaClient): void;

  protected emitError(err: Error): void;

  private _check(kafkaClient: KafkaClient): void;
}

export class Consumer extends Client {

  public kafkaConsumer: Kafka.KafkaConsumer;

  constructor(conf?: ConsumerConfig, topicConfig?: TopicConfig);

  public onMessage<Type>(): Observable<MessagePayload<Type>>;

  public connect(): Promise<{ name: string }>;

  public disconnect(): Promise<void>;

  public comsume(): void;

  public commit(topicPartition: number): void

  private _initEvent(): void;

}

export class Producer extends Client {

  public kafkaProducer: Kafka.Producer;

  constructor(conf?: ProducerConfig, topicConfig?: TopicConfig);

  public publish(message: string | Buffer | number | object | boolean, topic?: string, partition?: number, key?: string, opaque?: string): Promise<DeliveryReport>;

  public onReport(): Observable<DeliveryReport>;

  public connect(): Promise<{ name: string }>;

  public disconnect(): Promise<void>;

  public poll(): void;

  private _initEvent(): void;
}

export interface KafkaWrapper {
  consumer: Consumer;
  producer: Producer;
}