import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import log from 'electron-log';
import temp from 'temp';

import checkForUpdates from './checkForUpdates';

const updateScript = path.join(__dirname, '../bin/update.sh');

export default async function execUpdate(updates) {
    log.info('Executing an Update');
    const tempScript = temp.path({ prefix: 'kegger', suffix: '.sh' });
    await fs.copy(updateScript, tempScript);
    await fs.writeFile(tempScript, createScript(updates, tempScript));

    exec(`open -b com.apple.terminal ${tempScript} -F`, (error, stdout, stderr) => {
        if (error) {
            log.error(error);
            log.error(stderr);
            throw new Error(error);
        }

        log.info('Executed Update');
        checkForUpdates();
    });
}

const createScript = ({ brew, cask }, tempScript) => `#!/bin/bash
echo Kegger - Join the party
echo
${brew.length !== 0 ? `brew upgrade ${brew.filter(update => !update.isPinned).map(update => update.name).join(' ')}` : ''}
${cask.length !== 0 ? `brew cask install --force ${cask.filter(update => !update.isPinned).map(update => update.name).join(' ')}` : ''}
echo
echo Updated Finished - There may be further instructions listed above
read -n 1 -s -r -p "Press any key to close"
rm -f ${tempScript}
`;
