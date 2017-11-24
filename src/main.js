import { app, nativeImage } from 'electron';

import createTray from'./tray/createTray';
import createTrayMenu from'./tray/createTrayMenu';
import createTrayIcon from'./tray/createTrayIcon';
import checkForUpdates from'./brew/checkForUpdates';

import log from'electron-log';
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
        await update(true);
        update();

        setInterval(update, 60 * 60 * 1000);
    } catch (error) {
        log.error(error);
    }
});


app.on('window-all-closed', () => {
    app.quit();
});

process.on('error', log.error);

app.on('quit', () => {
    log.info('App exited');
});

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party',
    copyright: 'BealeARTS - David Beale',
    credits: 'Barrel Icon created by Loren Klein https://thenounproject.com/lorenklein/'
});


async function update(skipBrewUpdate = false) {
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
