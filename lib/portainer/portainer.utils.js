const axios = require('axios');

const BASE = '/api';
const AUTH = `${BASE}/auth`;
const STACKS = `${BASE}/stacks`;

/**
 * Return header with authed JWT
 * @param {String} jwt - Token from login()
 * @returns {Header} Generated Header with JWT
 */
function HEADER(jwt) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };
}

/**
 * Authenticate login on portainer API
 * @param {String} url - Portainer URL
 * @param {String} user - Portainer user
 * @param {String} password - Portainer password
 * @returns {Promise<String>} Generated JWT token
 */
async function login(url, user, password) {
  return new Promise((resolve, reject) => {
    axios.post(url + AUTH, {
      Username: user,
      Password: password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => {
      resolve(response.data.jwt);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getStacks(jwt, url) {
  return new Promise((resolve, reject) => {
    axios.get(url + STACKS,
      HEADER(jwt)).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * Get the stack file content from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @param {String} id - Stack ID (<stack name>_<swarm ID>
 * @returns {Promise<JSON>} JSON Object containing only the stack file content
 */
async function getStackFile(jwt, url, id) {
  return new Promise((resolve, reject) => {
    axios.get(`${url}${STACKS}/${id}/file`,
      HEADER(jwt)).then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  login,
  getStacks,
  getStackFile,
};
