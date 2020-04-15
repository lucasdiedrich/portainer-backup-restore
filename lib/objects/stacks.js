const config = require('config');

const portainer = require('../utils/portainer');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../utils/file');

const Endpoint = portainer.STACKS;
const filename = `${config.tmpFolder}/stacks.json`;

/**
 * Retrieve portainer's stacks and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all stacks from portainer
  const stacks = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${stacks.length} stack(s).`);

  const backups = [];
  const stackPromisses = [];

  // For each stack, get it's stackfime
  for (let i = 0; i < stacks.length; i += 1) {
    const stack = stacks[i];
    stackPromisses.push(
      portainer.getObjects(jwt, url, `${Endpoint}/${stack.Id}/file`).then((stackFile) => {
        log.debug(`Found stack file for ID: ${stack.Id}.`);
        backups.push({
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
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} stack(s) to ${filename}`);
}

module.exports = {
  backup,
};
