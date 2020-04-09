// const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'endpoints-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getEndpoints(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.ENDPOINTS);
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getEndpoint(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, portainer.ENDPOINTS);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const endpoints = await getEndpoints(jwt, url);
  log.info(`Found ${endpoints.length} endpoints(s).`);

  const backups = [];
  const endpointPromisses = [];

  // For each endpoint, get it's endpointfime
  for (let i = 0; i < endpoints.length; i += 1) {
    const endpoint = endpoints[i];
    endpointPromisses.push(
      getEndpoint(jwt, url, endpoint.Id).then((endpointData) => {
        log.debug(`Found endpoint file for ID: ${endpoint.Id}.`);
        backups.push({
          Id: endpoint.Id,
          Name: endpoint.Name,
          EndpointContent: endpointData,
        });
      }),
    );
  }
  // Call as promisses to get stack details.
  await Promise.all(endpointPromisses);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} stack(s) to ${filename}`);
}

module.exports = {
  backup,
};
