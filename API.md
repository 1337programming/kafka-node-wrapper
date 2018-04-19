# API


<a name="Consumer"></a>

## Consumer
Kafka Consumer

**Kind**: global class

* [Consumer](#Consumer)
    * [new Consumer(topicConfig)](#new_Consumer_new)
    * [.connect()](#Consumer+connect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.disconnect()](#Consumer+disconnect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.message()](#Consumer+message) ⇒ <code>Observable.&lt;T&gt;</code>

<a name="new_Consumer_new"></a>

### new Consumer(topicConfig)

| Param | Type | Description |
| --- | --- | --- |
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



<a name="Producer"></a>

## Producer
Kafka Consumer for

**Kind**: global class

* [Producer](#Producer)
    * [new Producer(topicConfig)](#new_Producer_new)
    * [.connect()](#Producer+connect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.disconnect()](#Producer+disconnect) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.publish(message, partition, key, opaque)](#Producer+publish) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.report()](#Producer+report) ⇒ <code>Observable.&lt;T&gt;</code>

<a name="new_Producer_new"></a>

### new Producer(topicConfig)

| Param | Type | Description |
| --- | --- | --- |
| topicConfig | <code>TopicConfig</code> | the Kafka Topic Configuration |

<a name="Producer+connect"></a>

### producer.connect() ⇒ <code>Promise.&lt;void&gt;</code>
Connect to Kafka

**Kind**: instance method of [<code>Producer</code>](#Producer)
<a name="Producer+disconnect"></a>

### producer.disconnect() ⇒ <code>Promise.&lt;void&gt;</code>
Disconnect from Kafka

**Kind**: instance method of [<code>Producer</code>](#Producer)
<a name="Producer+publish"></a>

### producer.publish(message, partition, key, opaque) ⇒ <code>Promise.&lt;void&gt;</code>
Publish a message

**Kind**: instance method of [<code>Producer</code>](#Producer)
**Returns**: <code>Promise.&lt;void&gt;</code> - // @TODO fix and review with Prasana

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>String</code> |  | message to send |
| partition | <code>Number</code> |  | optionally  specify a partition for the message, this defaults to -1 - which will  use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages) |
| key | <code>String</code> | <code></code> | keyed message (optional) |
| opaque | <code>String</code> | <code></code> | opaque token which gets passed along to your delivery reports |

<a name="Producer+report"></a>

### producer.report() ⇒ <code>Observable.&lt;T&gt;</code>
Stream delivery report from the kafka producer

**Kind**: instance method of [<code>Producer</code>](#Producer)
