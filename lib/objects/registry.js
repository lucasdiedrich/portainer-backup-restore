
const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const Endpoint = portainer.REGISTRIES;
const filename = `${config.tmpFolder}/registry.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const registries = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${registries.length} registry.`);

  const backups = [];
  const registriesPromisse = [];

  // For each registry, get it's registry
  for (let i = 0; i < registries.length; i += 1) {
    const registry = registries[i];
    registriesPromisse.push(
      portainer.getObjectDetail(jwt, url, registry.Id, Endpoint).then((registryData) => {
        log.debug(`Found registry file for ID: ${registry.Id}.`);
        backups.push({
          Id: registry.Id,
          Name: registry.Name,
          registryContent: registryData,
        });
      }),
    );
  }
  // Call as promisses to get stack details.
  await Promise.all(registriesPromisse);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} registry to ${filename}`);
}

module.exports = {
  backup,
};
