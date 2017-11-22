import execBrew from './execBrew';

export default async function listUpdates() {
    const pinned = execBrew('list --pinned');
    const [brew, cask] = await Promise.all([
        execBrew('outdated --verbose')
            .then(parse(pinned)),
        execBrew('cask outdated --verbose')
            .then(parse(pinned))
    ]);

    return {
        brew,
        cask
    };
}

function parse(pinned) {
    return rows => rows.map(((row) => {
        const [name, version, nq, available] = row.split(' ');
        return {
            name,
            current: version.substr(1, version.length - 2),
            available,
            isPinned: pinned.some(pin => pin === name)
        };
    }));
}
