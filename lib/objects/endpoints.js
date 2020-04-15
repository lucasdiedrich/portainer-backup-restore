const config = require('config');

const portainer = require('../utils/portainer');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../utils/file');

const Endpoint = portainer.ENDPOINTS;
const filename = `${config.tmpFolder}/endpoints.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const endpoints = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${endpoints.length} endpoints(s).`);

  const backups = [];
  const endpointPromisses = [];

  // For each endpoint, get it's endpointfime
  for (let i = 0; i < endpoints.length; i += 1) {
    const endpoint = endpoints[i];
    endpointPromisses.push(
      portainer.getObjectDetail(jwt, url, endpoint.Id, Endpoint).then((endpointData) => {
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
  log.info(`Saved ${backup.length} endpoint(s) to ${filename}`);
}

module.exports = {
  backup,
};
