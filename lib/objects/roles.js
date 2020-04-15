const config = require('config');

const log = require('../logger/logger')('StacksUtils');

const portainer = require('../utils/portainer');
const backupFile = require('../utils/file');

const Endpoint = portainer.ROLES;
const filename = `${config.tmpFolder}/roles.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const roles = await portainer.getObjects(jwt, url, Endpoint);
  log.info('Found role(s) configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, roles);
  log.info(`Saved role(s) configuration to ${filename}`);
}

module.exports = {
  backup,
};
