const log = require('electron-log');

const updateBrew = require('./updateBrew');
const listOutdated = require('./listOutdated');

module.exports = function checkForUpdates(skipBrewUpdate = false) {
    if (skipBrewUpdate) {
        return listOutdated();
    }

    return updateBrew()
        .catch(() => log.warn('Could not update Brew - Probably offline'))
        .then(listOutdated);
}
