const execBrew = require('./execBrew');

module.exports = function listOutdated() {
    return Promise.all([
        execBrew('outdated --verbose'),
        execBrew('cask outdated --verbose'),
    ])
    .then(results => [...results[0], ...results[1]])
    .then(list => list.map((line => {
        const [ name, version, nq, available ] = line.split(' ');
        return {
            name,
            version: version.substr(1, version.length-2),
            available
        }
    })));
}
