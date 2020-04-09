const bunyan = require('bunyan');
const config = require('config');

const log = bunyan.createLogger({
  name: 'logger',
  application: config.name,
  src: true,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  streams: [
    {
      level: config.consoleLogLevel,
      stream: process.stdout,
    },
  ],
});

const child = (name) => log.child({ loggerName: name });

module.exports = child;
