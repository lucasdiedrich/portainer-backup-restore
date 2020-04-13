// const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'registry-backup.json';

/**
 * Get all the registries from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the registries
 */
async function getRegistries(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.REGISTRIES);
}

/**
 * Get the registry file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - registry ID (<registry name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the registry file content
 */
async function getRegistry(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, portainer.REGISTRIES);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const registries = await getRegistries(jwt, url);
  log.info(`Found ${registries.length} registry.`);

  const backups = [];
  const registriesPromisse = [];

  // For each registry, get it's registry
  for (let i = 0; i < registries.length; i += 1) {
    const registry = registries[i];
    registriesPromisse.push(
      getRegistry(jwt, url, registry.Id).then((registryData) => {
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
