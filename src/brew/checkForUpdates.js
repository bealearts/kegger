const listOutdated = require('./listOutdated');

module.exports = function checkForUpdates() {
    return listOutdated();
}
