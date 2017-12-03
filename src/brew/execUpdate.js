import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import log from 'electron-log';
import temp from 'temp';

const updateScript = path.join(__dirname, '../bin/update.sh');

export default async function execUpdate(updates) {
    const updateable = {
        brew: updates.brew.filter(update => !update.isPinned),
        cask: updates.cask.filter(update => !update.isPinned)
    };
    log.info('Executing an Update for', updateable);

    const tempScript = temp.path({ prefix: 'kegger', suffix: '.sh' });
    await fs.copy(updateScript, tempScript);
    await fs.writeFile(tempScript, createScript(updateable, tempScript));

    exec(`open -b com.apple.terminal ${tempScript}`, (error, stdout, stderr) => {
        if (error) {
            log.error(error);
            log.error(stderr);
            throw new Error(error);
        }
    });
}

const createScript = ({ brew, cask }, tempScript) => `#!/bin/bash
echo Kegger - Join the party
echo
${brew.length !== 0 ? `brew upgrade ${brew.map(update => update.name).join(' ')}` : ''}
${cask.length !== 0 ? `brew cask install --force ${cask.map(update => update.name).join(' ')}` : ''}
kill -SIGUSR2 ${process.pid} > /dev/null 2>&1
echo
echo Updated Finished - There may be Errors or further instructions listed above
read -n 1 -s -r -p "Press any key to close"
rm -f ${tempScript}
`;
