const yargs = require('yargs');

const log = require('./lib/logger/logger')('Main');
const portainer = require('./lib/portainer/portainer.utils');
const stacks = require('./lib/objects/stacks.utils');
const hubs = require('./lib/objects/dockerhub.utils');
const endpoints = require('./lib/objects/endpoints');

const { argv } = yargs
  .command('backup', 'Back up stacks from portainer')
  .options({
    u: {
      demand: false,
      alias: 'url',
      describe: 'Portainer\'s URL',
      string: true,
    },
    l: {
      demand: false,
      alias: 'login',
      describe: 'User\'s login to use',
      string: true,
    },
    p: {
      demand: false,
      alias: 'password',
      describe: 'User\'s password',
      string: true,
    },
    d: {
      demand: false,
      alias: 'disablessl',
      describe: 'Disable TLS verification.',
      boolean: true,
    },
  })
  .implies('url', 'login')
  .implies('login', 'password')
  .implies('login', 'url')
  .implies('password', 'login')
  .implies('password', 'url')
  .help()
  .alias('help', 'h')
  .locale('en');

async function main() {
  log.debug('Starting app');

  // Disable the TLS verification.
  if (argv.disablessl) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // Log in and get JWT token from portainer
  const jwt = await portainer.login(argv.url, argv.login, argv.password);

  switch (argv._[0]) {
    case 'backup':
      // Get all stacks from portainer and save them to a json file
      await stacks.backup(jwt, argv.url);
      await hubs.backup(jwt, argv.url);
      await endpoints.backup(jwt, argv.url);
      break;
    default:
      log.warn('Unknown command'); break;
  }
}

main()
  .catch((err) => {
    if (err.response && err.response.data) {
      log.error({ err }, `Http error: ${err.response.data.err}`);
    } else {
      log.error({ err }, 'Application error.');
    }
  });
