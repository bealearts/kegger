const { app } = require('electron');
const path = require('path');

const createTray = require('./tray/createTray');
const createTrayMenu = require('./tray/createTrayMenu');
const createTrayIcon = require('./tray/createTrayIcon');
const checkForUpdates = require('./brew/checkForUpdates');

const log = require('electron-log');
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

app.pn('quit', () => {
    log.info('App exited');
})

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party'
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
