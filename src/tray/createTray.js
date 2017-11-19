const { Tray } = require('electron');
const path = require('path');

const createTrayMenu = require('./createTrayMenu');

module.exports = function createTray(trayIcon) {
    const tray = new Tray(trayIcon);
    tray.setToolTip('Kegger - Join the party');
    tray.setContextMenu(createTrayMenu());

    return tray;
}


// tray.on('right-click', toggleWindow)
// tray.on('double-click', toggleWindow)
// tray.on('click', function (event) {
//   toggleWindow()
//
//   // Show devtools when command clicked
//   if (window.isVisible() && process.defaultApp && event.metaKey) {
//     window.openDevTools({mode: 'detach'})
//   }
// })
