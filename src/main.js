const { app } = require('electron');
const path = require('path');

const createTray = require('./tray/createTray');
const checkForUpdates = require('./brew/checkForUpdates');
const createTrayMenu = require('./tray/createTrayMenu');

let tray = null;


app.dock.hide()

if (app.makeSingleInstance(() => false)) {
    app.quit();
}


app.on('ready', () => {
    tray = createTray()
})


app.on('window-all-closed', () => {
    app.quit()
})

app.setAboutPanelOptions({
    applicationName: 'Kegger - Join the party'
});


function update(skipBrewUpdate = false) {
    return checkForUpdates(skipBrewUpdate)
        .then(updates => tray.setContextMenu(createTrayMenu(updates)))
        .catch(console.error);
}

update(true)
    .then(update);

setInterval(update, 60 * 60 * 1000);
