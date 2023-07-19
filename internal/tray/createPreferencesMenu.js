import { app } from 'electron';
import log from 'electron-log';

export default function createPreferencesMenu() {
    const loginSettings = app.getLoginItemSettings();

    return [
        {
            label: 'Start at login',
            type: 'checkbox',
            checked: loginSettings.openAtLogin,
            click: (menuItem) => {
                const startAtLogin = menuItem.checked;

                log.info('Setting start at login Preference to', startAtLogin);
                app.setLoginItemSettings({
                    openAtLogin: startAtLogin,
                    openAsHidden: startAtLogin
                });
            }
        }
    ];
}
