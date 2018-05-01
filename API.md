<a name="top"></a>

# API

* [Configuration](#Configuration)
* [Consumer](#Consumer)
* [Producer](#Producer)


<a name="Configuration"></a>

## Configuration

### All

Configurations custom to this wrapper

|   Field    | Description|   Type     | Default   |
|------------|------------|------------|-----------|
| throttle   | Throttle interval time (ms) | Number | 500|
| topics     | Topics to subscribe to  | String[]  | \['kafka-test-topic'\] |
| autoInterval | Allow auto intervals for polling (producer) and consuming (consumer). | boolean  | true |

### Consumer

Configurations custom to this wrapper's Consumer class.

|   Field    | Description|   Type     | Default   |
|------------|------------|------------|-----------|
| consumeMax   | Number of messages to consume for each interval. | Number | 1 |

[back to top](#top)

<a name="Consumer"></a>

## Consumer
Kafka Consumer

**Kind**: global class

* [Consumer](#Consumer)
    * [new Consumer(conf, topicConfig)](#new_Consumer_new)
    * [.connect()](#Consumer+connect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.disconnect()](#Consumer+disconnect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.message()](#Consumer+message) ⇒ <code>Observable.&lt;T&gt;</code>
    * [.consume(limit)](#Consumer+consume)
    * [.commit()](#Consumer+commit)

<a name="new_Consumer_new"></a>

### new Consumer(conf, topicConfig)

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>ConsumerConfig</code> | defaults to default config |
| topicConfig | <code>TopicConfig</code> | the Kafka Topic Configuration |

<a name="Consumer+connect"></a>

### consumer.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Connect to Kafka

**Kind**: instance method of [<code>Consumer</code>](#Consumer)
<a name="Consumer+disconnect"></a>

### consumer.disconnect() ⇒ <code>Promise.&lt;void&gt;</code>
Disconnect from Kafka

**Kind**: instance method of [<code>Consumer</code>](#Consumer)
<a name="Consumer+message"></a>

### consumer.message() ⇒ <code>Observable.&lt;T&gt;</code>
Message stream to listen to

**Kind**: instance method of [<code>Consumer</code>](#Consumer)
**Returns**: <code>Observable.&lt;T&gt;</code> - - message stream
<a name="Consumer+consume"></a>

### consumer.consume(limit)
Consume message

**Kind**: instance method of [<code>Consumer</code>](#Consumer)

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | limit or number of messages to consume |

<a name="Consumer+commit"></a>

### consumer.commit()
Manual Commit

**Kind**: instance method of [<code>Consumer</code>](#Consumer)
**Optional**: @param {string=} topicPartition - topic partition to commit

<a name="Producer"></a>

<a name="Producer"></a>

## Producer
Kafka Producer

**Kind**: global class

* [Producer](#Producer)
    * [new Producer(conf, topicConfig)](#new_Producer_new)
    * [.connect()](#Producer+connect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.disconnect()](#Producer+disconnect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.publish(message, topic, partition, key, opaque)](#Producer+publish) ⇒ <code>Promise.&lt;DeliveryReport&gt;</code>
    * [.poll()](#Producer+poll)
    * [.report()](#Producer+report) ⇒ <code>Observable.&lt;DeliveryReport&gt;</code>

<a name="new_Producer_new"></a>

### new Producer(conf, topicConfig)

| Param | Type | Description |
| --- | --- | --- |
| conf | <code>ProducerConfig</code> | defaults to default config |
| topicConfig | <code>Config</code> | the Kafka Topic Configuration |

<a name="Producer+connect"></a>

### producer.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Connect to Kafka

**Kind**: instance method of [<code>Producer</code>](#Producer)
<a name="Producer+disconnect"></a>

### producer.disconnect() ⇒ <code>Promise.&lt;void&gt;</code>
Disconnect from Kafka

**Kind**: instance method of [<code>Producer</code>](#Producer)
<a name="Producer+publish"></a>

### producer.publish(message, topic, partition, key, opaque) ⇒ <code>Promise.&lt;DeliveryReport&gt;</code>
Publish a message

**Kind**: instance method of [<code>Producer</code>](#Producer)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>String</code> |  | message to send |
| topic | <code>String</code> |  | topic to send to |
| partition | <code>number</code> |  | optionally  specify a partition for the message, this defaults to -1 - which will  use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages) |
| key | <code>String</code> | <code></code> | keyed message (optional) |
| opaque | <code>String</code> | <code></code> | opaque token which gets passed along to your delivery reports |

<a name="Producer+poll"></a>

### producer.poll()
Polls the producer for delivery reports or other events to be transmitted via the emitter.

**Kind**: instance method of [<code>Producer</code>](#Producer)
<a name="Producer+report"></a>

### producer.report() ⇒ <code>Observable.&lt;DeliveryReport&gt;</code>
Stream delivery report from the kafka producer

**Kind**: instance method of [<code>Producer</code>](#Producer)

