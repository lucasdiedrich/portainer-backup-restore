# Portainer backup utility

## Introduction

This node app backup your Portainer objects and Docker services.

Current portainer API supported is 1.23.2

## Usage

docker run --name pbk \
           -v /etc/localtime:/etc/localtime \
           -v /volumes/data/config.json:/data/default.json \
           -v /volumes/data/backup/:/data/backup/ \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -d lucasdiedrich/portainer-backup-restore

### Backup

This command will create (or replace) a file named `<objects>.json` where all objects with `Total` control from portainer will be saved.
A backup file is mandatory to restore objects, but it can be created by hand if you follow the backup format.

    $ node . backup

The backup file are tar gzipped inside another <date-isostring>.tgz.

## Backup files format

The will one file for each portainer object available and onde aditional file for Docker services model.
    [
      {
        "Name": "nginx",
        "SwarmID": "jpofkc0i9uo9wtx1zesuk649w",
        "StackFileContent": "version: 3\n services:\n web:\n image:nginx"
      },
      {
        "Name": "HelloWorld",
        "SwarmID": "jpofkc0i9uo9wtx1zesuk649w",
        "StackFileContent": "version: 3\n services:\n hello-world:\n image:hello-world"

      }
    ]

### Config file example

`
{
  "name": "pbk-backup",
  "portainer": {
    "url": "https://exampleurl.com",
    "login": "blablabla",
    "password": "*******"
  },
  "consoleLogLevel": "trace",
  "backupFolder": "/data/backup",
  "disablessl": true, 
  "tmpFolder": "./tmp",
  "socketPath": "/var/run/docker.sock"
}
`

## Initial Project

This project was built on top of [portainer-backup-restore](https://github.com/s3pweb/portainer-backup-restore)
