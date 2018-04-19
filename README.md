# Kafka Docker Wrapper

### Running
TEST

* run `npm install`
* run `docker-compose up`

You can now see the producer tab making new messages and the consumer tab reading those messages. You can start more producers (while still running 1 consumer) and see more messages coming in.

### Topic Errors

If you are getting an error about the topic not existing, try running `docker-compose rm` to delete the containers. Then re-run `docker-compose up` again.

## API
<a name="Client"></a>

## Client
Kafka Client base class

**Kind**: global class

* [Client](#Client)
    * [.log()](#Client+log) ⇒ <code>Observable.&lt;log&gt;</code>
    * [.error()](#Client+error) ⇒ <code>Observable.&lt;Error&gt;</code>
    * [.connect()](#Client+connect)
    * [.disconnect()](#Client+disconnect)
    * [.initEvent()](#Client+initEvent)
    * [.emitError(err)](#Client+emitError)

<a name="Client+log"></a>

### client.log() ⇒ <code>Observable.&lt;log&gt;</code>
Listen to log stream

**Kind**: instance method of [<code>Client</code>](#Client)
**Returns**: <code>Observable.&lt;log&gt;</code> - - log message
<a name="Client+error"></a>

### client.error() ⇒ <code>Observable.&lt;Error&gt;</code>
Listen to error stream

**Kind**: instance method of [<code>Client</code>](#Client)
<a name="Client+connect"></a>

### client.connect()
Connect to Kafka

**Kind**: instance method of [<code>Client</code>](#Client)
**Access**: protected
<a name="Client+disconnect"></a>

### client.disconnect()
Disconnect from Kafka

**Kind**: instance method of [<code>Client</code>](#Client)
**Access**: protected
<a name="Client+initEvent"></a>

### client.initEvent()
Initializes the events

**Kind**: instance method of [<code>Client</code>](#Client)
**Access**: protected
<a name="Client+emitError"></a>

### client.emitError(err)
Emit error

**Kind**: instance method of [<code>Client</code>](#Client)
**Access**: protected

| Param | Description |
| --- | --- |
| err | Error to emit |
