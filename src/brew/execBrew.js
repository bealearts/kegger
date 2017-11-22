import { exec } from 'child_process';
import log from 'electron-log';

export default function execBrew(args) {
    return new Promise((resolve, reject) => {
        exec(`brew ${args}`, (error, stdout, stderr) => {
            if (error) {
                log.error(error);
                log.error(stderr);
                return reject(error);
            }

            const result = stdout.split('\n')
                .filter(line => line !== '');
            return resolve(result);
        });
    });
}
