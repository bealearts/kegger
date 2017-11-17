const { Menu } = require('electron');
const path = require('path');

const assetsDirectory = path.join(__dirname, '../../assets');

module.exports = function createTrayMenu(updates = [1]) {
    const hasUpdates = updates.length !== 0;
    const optionsMenu = hasUpdates ? createUpdatesMenuTemplate(updates) : null;

    const contextMenu = Menu.buildFromTemplate([
      {label: '0 Updates Available', submenu: optionsMenu, enabled: hasUpdates},
      {label: 'Update All', enabled: hasUpdates},
      {type: 'separator'},
      {label: 'Preferences...'},
      {label: 'About', role: "about"},
      {type: 'separator'},
      {label: 'Quit', role: 'quit'}
    ]);

    return contextMenu;
}


function createUpdatesMenuTemplate(updates = []) {
    return [
        {label: 'Git 1.9 > 2.0', icon: path.join(assetsDirectory, 'sunTemplate.png')}
    ];
    //return updates.map();
}
