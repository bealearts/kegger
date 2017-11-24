import { Menu, nativeImage } from 'electron';
import path from 'path';

import execUpdate from '../brew/execUpdate';
import createAppIcon from './createAppIcon';

const assetsDirectory = path.join(__dirname, '../assets');
const brewIcon = nativeImage.createFromPath(path.join(assetsDirectory, 'kegTemplate.png'));

export default async function createTrayMenu(updates = { brew: [], cask: [] }) {
    const count = updates.brew.filter(update => !update.isPinned).length
        + updates.cask.filter(update => !update.isPinned).length;
    const hasUpdates = count !== 0;
    const updatesMenu = hasUpdates ? await createUpdatesMenuTemplate(updates) : null;
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


async function createUpdatesMenuTemplate(updates = { brew: [], cask: [] }) {
    const brewUpdates = updates.brew.filter(update => !update.isPinned);
    const brewItems = await Promise.all(brewUpdates.map(async update => ({
        label: `${update.name} ${update.info}`,
        click: () => execUpdate({ brew: [update], cask: [] }),
        icon: brewIcon
    })));

    const caskUpdates = updates.cask.filter(update => !update.isPinned);
    const caskItems = await Promise.all(caskUpdates.map(async update => ({
        label: `${update.name} ${update.info}`,
        click: () => execUpdate({ brew: [], cask: [update] }),
        icon: await createAppIcon(update.name)
    })));

    const updateable = brewItems.concat(caskItems);

    const pinned = updates.brew.filter(update => update.isPinned)
        .concat(updates.cask.filter(update => update.isPinned).map(update => ({
            ...update,
            isCask: true
        })));
    const pinndedItems = await await Promise.all(pinned.map(async update => ({
        label: `${update.name} ${update.info}`,
        click: () => {},
        icon: update.isCask ? await createAppIcon(update.name) : brewIcon
    })));

    const sep = pinndedItems.length !== 0 ? [{ type: 'separator' }] : [];
    return updateable.concat(sep.concat(pinndedItems));
}
