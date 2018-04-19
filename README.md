# Kafka Docker Wrapper

### Running
TEST

* run `npm install`
* run `docker-compose up`

You can now see the producer tab making new messages and the consumer tab reading those messages. You can start more producers (while still running 1 consumer) and see more messages coming in.

### Topic Errors

If you are getting an error about the topic not existing, try running `docker-compose rm` to delete the containers. Then re-run `docker-compose up` again.

## Use

Install
`$ npm install`

```javascript
const Kafka = require('kafka-node-wrapper'); // Node < 9.x
// import * as Kafka from 'kafka-node-wrapper' // Node > 9.x

const consumer = new Kafka.consumer();
const producer = new Kafka.producer();

// Connect with producer and consumer in parallel
function connect() {
  return Promise.all[consumer.connect(), producer.connect()];
}

function events() {
  // Consumer Events
  consumer.message()
    .subscribe((data) => {
      console.log('Data', data);
    });
  consumer.error()
    .subscribe((err) => {
      console.log('Consumer Error', err);
    });

  // Producer Events
  producer.report()
    .subscribe((report) => {
      console.log('Producer Delivery Report', report);
    });
  producer.error()
    .subscribe((err) => {
      console.log('Producer Error', err);
    });
}
```

