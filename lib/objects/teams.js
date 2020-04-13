const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const Endpoint = portainer.TEAMS;
const filename = `${config.backupFolder}/teams.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const teams = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${teams.length} team(s).`);

  const backups = [];
  const teamPromisses = [];

  // For each team, get it's teamfime
  for (let i = 0; i < teams.length; i += 1) {
    const team = teams[i];
    teamPromisses.push(
      portainer.getObjectDetail(jwt, url, team.Id, Endpoint).then((teamData) => {
        log.debug(`Found team file for ID: ${team.Id}.`);
        backups.push({
          Id: team.Id,
          Name: team.Name,
          TeamContent: teamData,
        });
      }),
    );
  }
  // Call as promisses to get team details.
  await Promise.all(teamPromisses);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} team(s) to ${filename}`);
}

module.exports = {
  backup,
};
