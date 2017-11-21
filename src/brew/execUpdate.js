const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const log = require('electron-log');

const checkForUpdates = require('./checkForUpdates');

const updateScript = path.join(__dirname, '../bin/update.sh');

module.exports = function execUpdate(updates) {
    log.info('Executing an Update');
    fs.writeFile(updateScript, createScript(updates))
        .then(() => exec(`open -b com.apple.terminal ${updateScript} -F`, (error, stdout, stderr) => {
            if (error) {
                log.error(error);
                log.error(stderr);
                return reject(error);
            }

            log.info('Executed Update');
            return;
        }))
        .then(checkForUpdates);
}

const createScript = ({brew, cask}) => `#!/bin/bash
echo Kegger - Join the party
echo
${brew.length !== 0 ? `brew upgrade ${brew.map(update => update.name).join(' ')}` : ''}
${cask.length !== 0 ? `brew cask install --force ${cask.map(update => update.name).join(' ')}` : ''}
echo
echo Updated Finished - There may be further instructions listed above
read -n 1 -s -r -p "Press any key to close"
`
