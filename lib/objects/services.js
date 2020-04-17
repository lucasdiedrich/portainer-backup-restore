const config = require('config');

const backupFile = require('../utils/file');
const docker = require('../utils/docker');

const log = require('../logger/logger')('StacksUtils');
const filename = `${config.tmpFolder}/services.json`;

/**
 * Retrieve docker's services and write then to the FS
 * @param {String} dockerRode - dockerRode from login()
 * @returns {Promise<>}
 */
async function backup(dockerRode) {
  // Get all services from docker
  const services = await docker.getServices(dockerRode);
  log.info(`Found ${services.length} service(s).`);

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, services);
  log.info(`Saved ${services.length} service(s) to ${filename}`);
}

module.exports = {
  backup,
};
