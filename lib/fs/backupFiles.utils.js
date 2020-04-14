const fs = require('fs');
const fse = require('fs-extra')

const config = require('config');
const tar = require('tar');

const ITERATOR = [];

function readFromBackupFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        fs.writeFile(filename, JSON.stringify(ITERATOR), (error) => {
          if (error) reject(error);
          resolve(JSON.stringify(ITERATOR));
        });
      }
      resolve(data);
    });
  });
}

function writeBackupFile(filename, backup) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(backup, null, 2), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// This function executes an tar -zcvf for the tmp folder
function tarBackup() {
  return new Promise((resolve, reject) => {
    let date = new Date().toISOString();

    tar.c({
      gzip: true,
      file: `${config.backupFolder}/pbk-${date}.tgz`,
      C: config.tmpFolder
    }, ['.']).then(_ => {

      // Erase all *.json files from .tmp
      fse.emptyDirSync(config.tmpFolder, (err) => {
        if (err)
          reject(err);
        resolve('GZIPED');
      });
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  readFromBackupFile,
  writeBackupFile,
  tarBackup
};
