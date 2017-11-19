const { app } = require('electron');
const path = require('path');

const createTray = require('./tray/createTray');
const createTrayMenu = require('./tray/createTrayMenu');
const createTrayIcon = require('./tray/createTrayIcon');
const checkForUpdates = require('./brew/checkForUpdates');

let tray = null;
let trayIcon = null;

app.dock.hide()

if (app.makeSingleInstance(() => false)) {
    app.quit();
}


app.on('ready', () => {
    trayIcon = createTrayIcon();
    tray = createTray(trayIcon);
    update(true)
        .then(update);

    setInterval(update, 60 * 60 * 1000);
})


app.on('window-all-closed', () => {
    app.quit()
})

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party'
});


function update(skipBrewUpdate = false) {
    return checkForUpdates(skipBrewUpdate)
        .then(updates => {
            const count = updates.brew.length + updates.cask.length;
            trayIcon.setTemplateImage(count === 0);
            tray.setImage(trayIcon);
            tray.setContextMenu(createTrayMenu(updates));
        })
        .catch(console.error);
}
