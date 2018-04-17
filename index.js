const Consumer = require('./consumer');
const Producer = require('./producer');

module.exports = {
  consumer: Consumer,
  producer: Producer
};

new Consumer()
  .connect()
  .then(() => {
    console.log('Done')
  })
  .catch((err) => {
    console.error(err);
  });