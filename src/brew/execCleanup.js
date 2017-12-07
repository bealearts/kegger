import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import log from 'electron-log';
import temp from 'temp';

const cleanupScript = path.join(__dirname, '../bin/update.sh');

export default async function execCleanup() {
    log.info('Executing a Cleanup');

    const tempScript = temp.path({ prefix: 'kegger', suffix: '.sh' });
    await fs.copy(cleanupScript, tempScript);
    await fs.writeFile(tempScript, createScript(tempScript));

    exec(`open -b com.apple.terminal ${tempScript}`, (error, stdout, stderr) => {
        if (error) {
            log.error(error);
            log.error(stderr);
            throw new Error(error);
        }
    });
}

const createScript = tempScript => `#!/bin/bash
echo Kegger - Join the party
echo
brew cleanup
echo
echo Cleanup Finished - There may be Errors listed above
read -n 1 -s -r -p "Press any key to close"
rm -f ${tempScript}
`;
