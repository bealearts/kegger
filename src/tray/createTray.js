import { Tray } from 'electron';

import createTrayMenu from './createTrayMenu';

export default async function createTray(trayIcon) {
    const tray = new Tray(trayIcon);
    tray.setToolTip('Kegger - Join the party');
    tray.setContextMenu(await createTrayMenu());

    return tray;
}
