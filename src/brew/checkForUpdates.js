import log from 'electron-log';

import updateBrew from './updateBrew';
import listUpdates from './listUpdates';

export default function checkForUpdates(skipBrewUpdate = false) {
    if (skipBrewUpdate) {
        return listUpdates();
    }

    return updateBrew()
        .catch(() => log.warn('Could not update Brew - Probably offline'))
        .then(listUpdates);
}
