const config = require('config');

const portainer = require('../utils/portainer');
const log = require('../logger/logger')('StacksUtils');
const backupFile = require('../utils/file');

const Endpoint = portainer.TEMPLATES;
const filename = `${config.tmpFolder}/templates.json`;

/**
 * Retrieve portainer's hubs and write then to the FS
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<>}
 */
async function backup(jwt, url) {
  // Get all hubs from portainer
  const templates = await portainer.getObjects(jwt, url, Endpoint);
  log.info(`Found ${templates.length} templates(s).`);

  const backups = [];
  const templatePromisses = [];

  // For each template, get it's templatefime
  for (let i = 0; i < templates.length; i += 1) {
    const template = templates[i];
    templatePromisses.push(
      portainer.getObjectDetail(jwt, url, template.Id, Endpoint).then((templateData) => {
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
