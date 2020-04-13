// const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'teams-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getTeams(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.TEAMS);
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getTeam(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, portainer.TEAMS);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const teams = await getTeams(jwt, url);
  log.info(`Found ${teams.length} team(s).`);

  const backups = [];
  const teamPromisses = [];

  // For each team, get it's teamfime
  for (let i = 0; i < teams.length; i += 1) {
    const team = teams[i];
    teamPromisses.push(
      getTeam(jwt, url, team.Id).then((teamData) => {
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
