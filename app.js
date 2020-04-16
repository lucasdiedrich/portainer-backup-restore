const yargs = require('yargs');

const log = require('./lib/logger/logger')('Main');
const portainer = require('./lib/utils/portainer');
const Docker = require('./lib/utils/docker');
const config = require('config');

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

  const url = argv.url || config.portainer.url;
  const login = argv.login || config.portainer.login;
  const password = argv.password || config.portainer.password;

  // Disable the TLS verification.
  if (argv.disablessl || config.disablessl) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  // Log in and get JWT token from portainer
  const jwt = await portainer.login(url, login, password);
  // Log in docker socket
  const dockerAuth = await Docker.login();

  switch (argv._[0]) {
    case 'backup':
      await PO.Stacks.backup(jwt, url);
      await PO.Dockerhub.backup(jwt, url);
      await PO.Endpoint.backup(jwt, url);
      await PO.EndpointGroup.backup(jwt, url);
      await PO.Extensions.backup(jwt, url);
      await PO.Registry.backup(jwt, url);
      await PO.Roles.backup(jwt, url);
      await PO.Settings.backup(jwt, url);
      await PO.SettingsPublic.backup(jwt, url);
      await PO.Status.backup(jwt, url);
      await PO.Tags.backup(jwt, url);
      await PO.TeamMemberships.backup(jwt, url);
      await PO.Teams.backup(jwt, url);
      await PO.Templates.backup(jwt, url);
      await PO.Users.backup(jwt, url);

      // Exec docker services backup
      // if(dockerAuth) {
      //   await PO.Services.backup(dockerAuth);
      // }
      // Tar -zcvf everything
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
