// const config = require('config');

const log = require('../logger/logger')('StacksUtils');
const portainer = require('../portainer/portainer.utils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'settingspublic-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getSettingsPublic(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.SETTINGS);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const hub = await getSettingsPublic(jwt, url);
  log.info('Found public settings configuration.');

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, hub);
  log.info(`Saved public settings configuration to ${filename}`);
}

module.exports = {
  backup,
};
