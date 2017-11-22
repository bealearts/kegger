import log from 'electron-log';

import updateBrew from './updateBrew';
import listOutdated from './listOutdated';

export default function checkForUpdates(skipBrewUpdate = false) {
    if (skipBrewUpdate) {
        return listOutdated();
    }

    return updateBrew()
        .catch(() => log.warn('Could not update Brew - Probably offline'))
        .then(listOutdated);
}
