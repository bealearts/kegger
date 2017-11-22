import execBrew from './execBrew';

export default function listOutdated() {
    return Promise.all([
        execBrew('outdated --verbose')
            .then(parse(false)),
        execBrew('cask outdated --verbose')
            .then(parse(true))
    ])
        .then(results => ({ brew: results[0], cask: results[1] }));
}

function parse(isCask) {
    return rows => rows.map(((row) => {
        const [name, version, nq, available] = row.split(' ');
        return {
            name,
            current: version.substr(1, version.length - 2),
            available,
            isCask
        };
    }));
}
