const yargs = require('yargs');

const log = require('./lib/logger/logger')('Main');
const portainer = require('./lib/utils/portainer');

// PortainerObjects
const PO = require('./lib/objects');
const FsUtils = require('./lib/utils/file');

const { argv } = yargs
  .command('backup', 'Back up stacks from portainer')
  .options({
    f: {
      demand: false,
      alias: 'configfile',
      describe: 'Config File with all variables.',
      string: true,
    },
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
    b: {
      demand: false,
      alias: 'backupFolder',
      describe: 'Backup folder.',
      string: true,
      default: './backup'
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
      await PO.Stacks.backup(jwt, argv.url);
      await PO.Dockerhub.backup(jwt, argv.url);
      await PO.Endpoint.backup(jwt, argv.url);
      await PO.EndpointGroup.backup(jwt, argv.url);
      await PO.Extensions.backup(jwt, argv.url);
      await PO.Registry.backup(jwt, argv.url);
      await PO.Roles.backup(jwt, argv.url);
      await PO.Settings.backup(jwt, argv.url);
      await PO.SettingsPublic.backup(jwt, argv.url);
      await PO.Status.backup(jwt, argv.url);
      await PO.Tags.backup(jwt, argv.url);
      await PO.TeamMemberships.backup(jwt, argv.url);
      await PO.Teams.backup(jwt, argv.url);
      await PO.Templates.backup(jwt, argv.url);
      await PO.Users.backup(jwt, argv.url);

      await FsUtils.tarBackup();
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
