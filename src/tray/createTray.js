import { Tray } from 'electron';
import path from 'path';

import createTrayMenu from './createTrayMenu';

export default function createTray(trayIcon) {
    const tray = new Tray(trayIcon);
    tray.setToolTip('Kegger - Join the party');
    tray.setContextMenu(createTrayMenu());

    return tray;
}
