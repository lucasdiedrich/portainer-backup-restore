const path = require('path');
const express = require('express');

const app = express();

const bf = require('../lib/fs/backupFiles.utils');

let stacks;
let stackfile;

async function loadDatas() {
  stacks = JSON.parse(await bf.readFromBackupFile(path.join(__dirname, '/data/stacks.json')));
  stackfile = JSON.parse(await bf.readFromBackupFile(path.join(__dirname, '/data/stackfile.json')));
}

// Add custom routes before JSON Server router
app.post('/api/auth', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ jwt: 'jwt_token' });
});

app.get('/api/endpoints/1/stacks', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(stacks);
});

app.get('/api/endpoints/1/stacks/:id/stackfile', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(stackfile);
});

exports.before = async (t) => {
  await loadDatas();

  /* eslint no-param-reassign: 2 */
  t.context.server = await app.listen(3333, () => new Promise((resolve) => {
    resolve();
  }));
};

exports.after = async (t) => {
  await t.context.server.close();
};
