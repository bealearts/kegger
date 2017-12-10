import { dialog, Menu, nativeImage } from 'electron';

import execUpdate from '../brew/execUpdate';
import updateableCount from '../brew/updateableCount';
import execCleanup from '../brew/execCleanup';
import getAppInfo from '../brew/getAppInfo';
import execBrew from '../brew/execBrew';
import createAppIcon from './createAppIcon';
import createPreferencesMenu from './createPreferencesMenu';

export default async function createTrayMenu(updates = { brew: [], cask: [] }) {
    const count = updateableCount(updates);
    const hasUpdates = count !== 0;
    const updatesMenu = hasUpdates ? await createUpdatesMenuTemplate(updates) : null;
    const updateLabel = `${count} Update${count === 0 || count > 1 ? 's' : ''} Available`;

    const contextMenu = Menu.buildFromTemplate([
        { label: updateLabel, submenu: updatesMenu, enabled: hasUpdates },
        { label: 'Update All', enabled: hasUpdates, click: () => execUpdate(updates) },
        { label: 'Cleanup', click: execCleanup },
        { type: 'separator' },
        { label: 'Preferences', submenu: createPreferencesMenu() },
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
        click: () => execUpdate({ brew: [update], cask: [] })
    })));

    const caskUpdates = updates.cask.filter(update => !update.isPinned);
    const caskItems = await Promise.all(caskUpdates.map(async (update) => {
        const info = await getAppInfo(update.name);
        return {
            label: `${info.name} ${update.info}`,
            click: () => execUpdate({ brew: [], cask: [update] }),
            icon: await createAppIcon(info)
        };
    }));

    const updateable = brewItems.concat(caskItems);

    const pinned = updates.brew.filter(update => update.isPinned)
        .concat(updates.cask.filter(update => update.isPinned).map(update => ({
            ...update,
            isCask: true
        })));
    const pinndedItems = await await Promise.all(pinned.map(async (update) => {
        let info = {
            name: update.name
        };

        if (update.isCask) {
            info = await getAppInfo(update.name);
        }

        return {
            label: `${info.name} ${update.info}`,
            click: confirmUpdatePinned(update),
            icon: update.isCask ? await createAppIcon(info) : null
        };
    }));

    const sep = pinndedItems.length !== 0 ? [{ type: 'separator' }] : [];
    return updateable.concat(sep.concat(pinndedItems));
}


function confirmUpdatePinned(update) {
    return () => {
        dialog.showMessageBox({
            type: 'question',
            title: 'Update Pinned',
            message: 'Are you sure you want to update pinned item?',
            detail: `${update.name} ${update.info}`,
            buttons: ['Cancel', 'Update']
        }, async (response) => {
            if (response === 1) {
                await execBrew(`unpin ${update.name}`);
                const updatePin = {
                    ...update,
                    isPinned: false
                };
                execUpdate({
                    brew: !update.isCask ? [updatePin] : [],
                    cask: update.isCask ? [updatePin] : []
                });
            }
        });
    };
}
