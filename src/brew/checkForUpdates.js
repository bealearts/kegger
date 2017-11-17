const updateBrew = require('./updateBrew');
const listOutdated = require('./listOutdated');

module.exports = function checkForUpdates() {
    return updateBrew()
        .catch()
        .then(listOutdated);
}
