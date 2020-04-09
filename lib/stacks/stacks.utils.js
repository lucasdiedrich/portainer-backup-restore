const config = require('config');

const log = require('../logger/logger')('StacksUtils');
const portainer = require('../portainer/portainer.utils');
const bf = require('../fs/backupFiles.utils');

const filename = config.backupFile;

/**
 * @param {String} url - Portainer URL
 * @param {String} user - Portainer login
 * @param {String} password - Portainer password
 * @returns {Promise<String>} JWT token if the login was successful
 */
async function login(url, user, password) {
  // Log in and get JWT token from portainer
  const jwt = await portainer.login(url, user, password);

  log.info('Logged in successfully.');

  return jwt;
}

/**
 * Retrieve portainer's stacks and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backupStacks(jwt, url) {
  // Get all stacks from portainer
  const stacks = await portainer.getStacks(jwt, url);
  log.info(`Found ${stacks.length} stack(s).`);

  const backup = [];
  const stackPromisses = [];

  // For each stack, get it's stackfime
  for (let i = 0; i < stacks.length; i += 1) {
    const stack = stacks[i];
    stackPromisses.push(
      portainer.getStackFile(jwt, url, stack.Id).then((stackFile) => {
        log.debug(`Found stack file for ID: ${stack.Id}.`);
        backup.push({
          Id: stack.Id,
          Name: stack.Name,
          SwarmID: stack.SwarmId,
          StackFileContent: stackFile.StackFileContent,
        });
      }),
    );
  }
  // Call as promisses to get stack details.
  await Promise.all(stackPromisses);

  // Write the backup to the file system
  await bf.writeBackupFile(filename, backup);
  log.info(`Saved ${backup.length} stack(s) to ${filename}`);
}

module.exports = {
  login,
  backupStacks,
};
