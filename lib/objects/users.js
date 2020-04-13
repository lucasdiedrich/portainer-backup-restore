// const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'users-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getUsers(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.USERS);
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getUser(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, portainer.USERS);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const users = await getUsers(jwt, url);
  log.info(`Found ${users.length} users(s).`);

  const backups = [];
  const userPromisses = [];

  // For each user, get it's userfime
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    userPromisses.push(
      getUser(jwt, url, user.Id).then((userData) => {
        log.debug(`Found user for ID: ${user.Id}.`);
        backups.push({
          Id: user.Id,
          Name: user.Name,
          userContent: userData,
        });
      }),
    );
  }
  // Call as promisses to get stack details.
  await Promise.all(userPromisses);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} user(s) to ${filename}`);
}

module.exports = {
  backup,
};
