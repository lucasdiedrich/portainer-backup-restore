const config = require('config');

const portainer = require('../utils/portainer');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../utils/file');

const Endpoint = portainer.STATUS;
const filename = `${config.tmpFolder}/status.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const hub = await portainer.getObjects(jwt, url, Endpoint);
  log.info('Found status configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, hub);
  log.info(`Saved status configuration to ${filename}`);
}

module.exports = {
  backup,
};
