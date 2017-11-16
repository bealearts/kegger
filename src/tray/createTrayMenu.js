const { Menu } = require('electron');

module.exports = function createTrayMenu(updates = []) {
    const hasUpdates = updates.length !== 0;

    const contextMenu = Menu.buildFromTemplate([
      {label: '0 Updates Available', enabled: hasUpdates},
      {label: 'Update All', enabled: hasUpdates},
      {type: 'separator'},
      {label: 'Preferences...'},
      {label: 'About', role: "about"},
      {type: 'separator'},
      {label: 'Quit', role: 'quit'}
    ]);

    return contextMenu;
}
