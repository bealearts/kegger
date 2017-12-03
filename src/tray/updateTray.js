import log from 'electron-log';

import checkForUpdates from '../brew/checkForUpdates';
import createTrayMenu from './createTrayMenu';

export default async function updateTray(tray, trayIcon, skipBrewUpdate = false) {
    try {
        log.info('Performing update check');
        const updates = await checkForUpdates(skipBrewUpdate);
        const count = updates.brew.length + updates.cask.length;
        trayIcon.setTemplateImage(count === 0);
        tray.setImage(trayIcon);
        tray.setContextMenu(await createTrayMenu(updates));
    } catch (error) {
        log.error(error);
    }
}
