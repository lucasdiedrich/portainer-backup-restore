const axios = require('axios');

const BASE = '/api';
const AUTH = `${BASE}/auth`;
const STACKS = `${BASE}/stacks`;
const DOCKERHUBS = `${BASE}/dockerhub`;
const ENDPOINTS = `${BASE}/endpoints`;
const ENDPOINTS_GROUPS = `${BASE}/endpoints_groups`;
const EXTENSIONS = `${BASE}/extensions`;
const REGISTRIES = `${BASE}/registries`;
const RESOURCE_CONTROLS = `${BASE}/resource_controls`;
const ROLES = `${BASE}/roles`;
const SETTINGS = `${BASE}/settings`;
const SETTINGS_PUBLIC = `${BASE}/settings_public`;
const STATUS = `${BASE}/status`;
const USERS = `${BASE}/users`;
const TAGS = `${BASE}/tags`;
const TEAMS = `${BASE}/teams`;
const TEAM_MEMBERSHIP = `${BASE}/team_membership`;
const TEMPLATES = `${BASE}/templates`;

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


/**
 * Get all the stacks from portainer API
 * @param {String} jwt - Token from login()
 * @param {String} url - Portainer URL
 * @returns {Promise<JSON>} JSON Object containing all the stacks
 */
async function getDockerHubs(jwt, url) {
  return new Promise((resolve, reject) => {
    axios.get(url + DOCKERHUBS,
      HEADER(jwt)).then((response) => {
      resolve(response.data);
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
async function getEndpoints(jwt, url) {
  return new Promise((resolve, reject) => {
    axios.get(url + ENDPOINTS,
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
async function getEndpoint(jwt, url, id) {
  return new Promise((resolve, reject) => {
    axios.get(`${url}${ENDPOINTS}/${id}`,
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
  getDockerHubs,
  getEndpoint,
  getEndpoints,
};
