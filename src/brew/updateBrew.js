const execBrew = require('./execBrew');

module.exports = function updateBrew() {
    return execBrew('update --quiet');
}
