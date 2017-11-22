import { Menu } from 'electron';

import execUpdate from '../brew/execUpdate';

export default function createTrayMenu(updates = { brew: [], cask: [] }) {
    const count = updates.brew.filter(update => !update.isPinned).length
        + updates.cask.filter(update => !update.isPinned).length;
    const hasUpdates = count !== 0;
    const updatesMenu = hasUpdates ? createUpdatesMenuTemplate(updates) : null;
    const updateLabel = `${count} Update${count === 0 || count > 1 ? 's' : ''} Available`;

    const contextMenu = Menu.buildFromTemplate([
        { label: updateLabel, submenu: updatesMenu, enabled: hasUpdates },
        { label: 'Update All', enabled: hasUpdates, click: () => execUpdate(updates) },
        { type: 'separator' },
        { label: 'Preferences...' },
        { label: 'About', role: 'about' },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
    ]);

    return contextMenu;
}


function createUpdatesMenuTemplate(updates = { brew: [], cask: [] }) {
    const brewItems = updates.brew.filter(update => !update.isPinned).map(update => ({
        label: `${update.name} ${update.info}`,
        click: () => execUpdate({ brew: [update], cask: [] })
    }));

    const caskItems = updates.cask.filter(update => !update.isPinned).map(update => ({
        label: `${update.name} ${update.info}`,
        click: () => execUpdate({ brew: [], cask: [update] })
    }));

    const updateable = brewItems.concat(caskItems);
    const pinned = updates.brew.filter(update => update.isPinned)
        .concat(updates.cask.filter(update => update.isPinned))
        .map(update => ({
            label: `${update.name} ${update.info}`,
            click: () => {}
        }));

    const sep = pinned.length !== 0 ? [{ type: 'separator' }] : [];
    return updateable.concat(sep.concat(pinned));
}
