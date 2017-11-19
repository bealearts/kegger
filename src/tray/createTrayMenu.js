const { Menu } = require('electron');
const path = require('path');

const execUpdate = require('../brew/execUpdate');

module.exports = function createTrayMenu(updates = {brew: [], cask: []}) {
    const count = updates.brew.length + updates.cask.length;
    const hasUpdates = count !== 0;
    const optionsMenu = hasUpdates ? createUpdatesMenuTemplate(updates) : null;

    const contextMenu = Menu.buildFromTemplate([
      {label: `${count} Updates Available`, submenu: optionsMenu, enabled: hasUpdates},
      {label: 'Update All', enabled: hasUpdates, click: () => execUpdate(updates)},
      {type: 'separator'},
      {label: 'Preferences...'},
      {label: 'About', role: "about"},
      {type: 'separator'},
      {label: 'Quit', role: 'quit'}
    ]);

    return contextMenu;
}


function createUpdatesMenuTemplate(updates = {brew: [], cask: []}) {
    const brewItems = updates.brew.map(update => ({
        label: `${update.name} (${update.current} -> ${update.available})`,
        click: () => execUpdate({brew: [update], cask: []})
    }));

    const caskItems = updates.cask.map(update => ({
        label: `${update.name} (${update.current} -> ${update.available})`,
        click: () => execUpdate({brew: [], cask: [update]})
    }));

    const sep = brewItems.length !== 0 && caskItems.length !== 0 ? [{type: 'separator'}] : [];
    return brewItems.concat(sep.concat(caskItems));
}
