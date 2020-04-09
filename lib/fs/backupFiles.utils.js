const fs = require('fs');

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

module.exports = {
  readFromBackupFile,
  writeBackupFile,
};
