const { exec } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const checkForUpdates = require('./checkForUpdates');

const updateScript = path.join(__dirname, '../bin/update.sh');

module.exports = function execUpdate(updates) {
    fs.writeFile(updateScript, createScript(updates))
        .then(() => exec(`open -b com.apple.terminal ${updateScript} -F`))
        .then(checkForUpdates);
}

const createScript = ({brew, cask}) => `#!/bin/bash
echo Kegger - Join the party
echo
${brew.length !== 0 ? `brew upgrade ${brew.map(update => update.name).join(' ')}` : ''}
${cask.length !== 0 ? `brew cask install --force ${cask.map(update => update.name).join(' ')}` : ''}
`
