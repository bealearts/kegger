import { app } from 'electron';
import log from 'electron-log';

import createTray from './tray/createTray';
import createTrayIcon from './tray/createTrayIcon';
import updateTray from './tray/updateTray';

log.transports.file.level = 'info';

let tray = null;
let trayIcon = null;

app.dock.hide();

if (app.makeSingleInstance(() => false)) {
    log.warn('Closing as App already running');
    app.quit();
}


app.on('ready', async () => {
    try {
        log.info('App running');
        trayIcon = createTrayIcon();
        tray = await createTray(trayIcon);
        await updateTray(tray, trayIcon, true);
        updateTray(tray, trayIcon);

        setInterval(() => updateTray(tray, trayIcon), 60 * 60 * 1000);
    } catch (error) {
        log.error(error);
    }
});


app.on('window-all-closed', () => {
    app.quit();
});


process.on('uncaughtException', log.error);

process.on('unhandledRejection', log.error);

process.on('SIGUSR2', () => updateTray(tray, trayIcon));


app.on('quit', () => {
    log.info('App exited');
});

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party',
    copyright: 'BealeARTS - David Beale',
    credits: 'Barrel Icon created by Loren Klein https://thenounproject.com/lorenklein/'
});
