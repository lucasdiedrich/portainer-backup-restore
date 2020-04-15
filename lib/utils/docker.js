
const Docker = require('dockerode');
const config = require('config');
const fs = require('fs')

/**
 * Get a docker object to get Objects
 * @returns {Promise<JSON>} DockerRode object
 */
async function login() {
  // Only return the object if the file config.socketPath exists
  try {
    if (fs.existsSync(config.socketPath)) {
      return new Docker({ socketPath: config.socketPath });
    } else {
      return null;
    }
  } catch(err) {
    console.error(err)
    return null;
  }
}

/**
 * Get all services running
 * @param {String} dockerRode - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} endpoint - Portainer endpoint
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getServices(dockerRode) {
  return new Promise((resolve, reject) => {
    dockerRode.listServices().then((err, services) => {
      if (err)
        reject(err);

      resolve(services);
    })
  });
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Dockerrode from login()
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getServiceDetail(dockerRode, id) {
  return new Promise((resolve, reject) => {
    dockerRode.getService(id).then((err, service) => {
      if (err)
        reject(err);

      resolve(service);
    })
  });
}

module.exports = {
  login,
  getServices,
  getServiceDetail,
};
