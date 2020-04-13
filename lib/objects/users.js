const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const Endpoint = portainer.USERS;
const filename = `${config.backupFolder}/users.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const users = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${users.length} users(s).`);

  const backups = [];
  const userPromisses = [];

  // For each user, get it's userfime
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    userPromisses.push(
      portainer.getObjectDetail(jwt, url, user.Id, Endpoint).then((userData) => {
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
