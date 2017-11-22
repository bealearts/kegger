import { app, nativeImage } from 'electron';

import createTray from'./tray/createTray';
import createTrayMenu from'./tray/createTrayMenu';
import createTrayIcon from'./tray/createTrayIcon';
import checkForUpdates from'./brew/checkForUpdates';

import log from'electron-log';
log.transports.file.level = 'info';

let tray = null;
let trayIcon = null;

app.dock.hide()

if (app.makeSingleInstance(() => false)) {
    log.warn('Closing as App already running');
    app.quit();
}


app.on('ready', () => {
    log.info('App running');
    trayIcon = createTrayIcon();
    tray = createTray(trayIcon);
    update(true)
        .then(update);

    setInterval(update, 60 * 60 * 1000);
})


app.on('window-all-closed', () => {
    app.quit()
})

process.on('error', log.error);

app.on('quit', () => {
    log.info('App exited');
})

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party',
    copyright: 'BealeARTS - David Beale',
    credits: 'Barrel Icon created by Loren Klein https://thenounproject.com/lorenklein/'
});


function update(skipBrewUpdate = false) {
    log.info('Performing update check');
    return checkForUpdates(skipBrewUpdate)
        .then(updates => {
            const count = updates.brew.length + updates.cask.length;
            trayIcon.setTemplateImage(count === 0);
            tray.setImage(trayIcon);
            tray.setContextMenu(createTrayMenu(updates));
        })
        .catch(log.error);
}
