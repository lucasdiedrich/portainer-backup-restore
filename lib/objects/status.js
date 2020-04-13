// const config = require('config');

const log = require('../logger/logger')('StacksUtils');
const portainer = require('../portainer/portainer.utils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'status-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getStatus(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.STATUS);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const hub = await getStatus(jwt, url);
  log.info('Found status configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, hub);
  log.info(`Saved status configuration to ${filename}`);
}

module.exports = {
  backup,
};
