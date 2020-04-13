const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const Endpoint = portainer.EXTENSIONS;
const filename = `${config.backupFolder}/extensions.json`;

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getExtension(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, Endpoint);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const extensions = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${extensions.length} extension(s).`);

  const backups = [];
  const extensionPromisses = [];

  // For each extension, get it's extensionfime
  for (let i = 0; i < extensions.length; i += 1) {
    const extension = extensions[i];
    extensionPromisses.push(
      portainer.getObjectDetail(jwt, url, extension.Id, Endpoint).then((extensionData) => {
        log.debug(`Found extension file for ID: ${extension.Id}.`);
        backups.push({
          Id: extension.Id,
          Name: extension.Name,
          extensionContent: extensionData,
        });
      }),
    );
  }
  // Call as promisses to get stack details.
  await Promise.all(extensionPromisses);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} extension(s) to ${filename}`);
}

module.exports = {
  backup,
};
