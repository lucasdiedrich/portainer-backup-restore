// const config = require('config');

const log = require('../logger/logger')('StacksUtils');
const portainer = require('../portainer/portainer.utils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'roles-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getRoles(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.ROLES);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const roles = await getRoles(jwt, url);
  log.info('Found role(s) configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, roles);
  log.info(`Saved role(s) configuration to ${filename}`);
}

module.exports = {
  backup,
};
