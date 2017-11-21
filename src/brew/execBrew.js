const { exec } = require('child_process');
const log = require('electron-log');

module.exports = function execBrew(args) {
    return new Promise((resolve, reject) => {
        exec(`brew ${args}`, (error, stdout, stderr) => {
            if (error) {
                log.error(error);
                log.error(stderr);
                return reject(error);
            }

            const result = stdout.split('\n')
                .filter(line => line !== '');
            resolve(result);
        });
    });
}
