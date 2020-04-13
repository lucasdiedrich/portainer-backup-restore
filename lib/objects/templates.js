// const config = require('config');

const portainer = require('../portainer/portainer.utils');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../fs/backupFiles.utils');

const filename = 'templates-backup.json';

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getTemplates(jwt, url) {
  return portainer.getObjects(jwt, url, portainer.TEMPLATES);
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getTemplate(jwt, url, id) {
  return portainer.getObjectDetail(jwt, url, id, portainer.TEMPLATES);
}

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const templates = await getTemplates(jwt, url);
  log.info(`Found ${templates.length} templates(s).`);

  const backups = [];
  const templatePromisses = [];

  // For each template, get it's templatefime
  for (let i = 0; i < templates.length; i += 1) {
    const template = templates[i];
    templatePromisses.push(
      getTemplate(jwt, url, template.Id).then((templateData) => {
        log.debug(`Found template file for ID: ${template.Id}.`);
        backups.push({
          Id: template.Id,
          Name: template.Name,
          TemplateContent: templateData,
        });
      }),
    );
  }
  // Call as promisses to get template details.
  await Promise.all(templatePromisses);
  // Write the backup to the file system
  await backupFile.writeBackupFile(filename, backups);
  log.info(`Saved ${backup.length} template(s) to ${filename}`);
}

module.exports = {
  backup,
};
