const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const Endpoint = portainer.TEAM_MEMBERSHIPS;
const filename = `${config.tmpFolder}/teammemberships.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const teammemberships = await portainer.getObjects(jwt, url, Endpoint);
  log.info('Found teammembership(s) configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, teammemberships);
  log.info(`Saved teammembership(s) configuration to ${filename}`);
}

module.exports = {
  backup,
};
