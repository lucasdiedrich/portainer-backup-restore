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
  log.info(`Found ${services.length} stack(s).`);

  const backups = [];
  const servicesPromisses = [];

  // For each service, get it' service detail
  for (let i = 0; i < services.length; i += 1) {
    const service = services[i];
    servicesPromisses.push(
      docker.getServiceDetail(dockerRode, service.ID).then((serviceObject) => {
        log.debug(`Found service file for ID: ${service.ID}.`);
        backups.push({
          Id: service.ID,
          serviceData: serviceObject,
        });
      }),
    );
  }
  // Call as promisses to get service details.
  await Promise.all(servicesPromisses);

  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} service(s) to ${filename}`);
}

module.exports = {
  backup,
};
