import { Menu } from 'electron';

import execUpdate from '../brew/execUpdate';

export default function createTrayMenu(updates = { brew: [], cask: [] }) {
    const count = updates.brew.length + updates.cask.length;
    const hasUpdates = count !== 0;
    const optionsMenu = hasUpdates ? createUpdatesMenuTemplate(updates) : null;

    const contextMenu = Menu.buildFromTemplate([
        { label: `${count} Updates Available`, submenu: optionsMenu, enabled: hasUpdates },
        { label: 'Update All', enabled: hasUpdates, click: () => execUpdate(updates) },
        { type: 'separator' },
        { label: 'Preferences...' },
        { label: 'About', role: 'about' },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
    ]);

    return contextMenu;
}


function createUpdatesMenuTemplate(updates = { brew: [], cask: [], pinned: [] }) {
    const brewItems = updates.brew.filter(update => !update.isPinned).map(update => ({
        label: `${update.name} (${update.current} -> ${update.available})`,
        click: () => execUpdate({ brew: [update], cask: [] })
    }));

    const caskItems = updates.cask.filter(update => !update.isPinned).map(update => ({
        label: `${update.name} (${update.current} -> ${update.available})`,
        click: () => execUpdate({ brew: [], cask: [update] })
    }));

    const updateable = brewItems.concat(caskItems);

    const sep = updates.pinned.length !== 0 ? [{ type: 'separator' }] : [];
    return updateable.concat(sep.concat(updates.pinned));
}
