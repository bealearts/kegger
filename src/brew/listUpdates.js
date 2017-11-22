import execBrew from './execBrew';

export default async function listUpdates() {
    const pinned = await execBrew('list --pinned');
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
        const [name, ...parts] = row.split(' ');
        return {
            name,
            info: parts.join(' '),
            isPinned: pinned.some(pin => pin === name)
        };
    }));
}
