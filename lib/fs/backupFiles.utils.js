const fs = require('fs')
const ITERATOR = [];

function readFromBackupFile (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        fs.writeFile(filename, JSON.stringify(ITERATOR), function (err) {
          if (err) reject(err);
          resolve(JSON.stringify(ITERATOR))
        });
        reject(err)
      }
      resolve(data)
    })
  })
}

function writeBackupFile (filename, backup) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(backup, null, 2), function (err) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

module.exports = {
  readFromBackupFile,
  writeBackupFile
}
