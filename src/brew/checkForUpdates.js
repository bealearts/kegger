const updateBrew = require('./updateBrew');
const listOutdated = require('./listOutdated');

module.exports = function checkForUpdates(skipBrewUpdate = false) {
    if (skipBrewUpdate) {
        return listOutdated();
    }
    
    return updateBrew()
        .catch()
        .then(listOutdated);
}
