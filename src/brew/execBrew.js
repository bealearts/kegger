const { exec } = require('child_process');

module.exports = function execBrew(args) {
    return new Promise((resolve, reject) => {
        exec(`brew ${args}`, (error, stdout) => {
            if (error) {
                return reject(error);
            }

            const result = stdout.split('\n')
                .filter(line => line !== '');
            resolve(result);
        });
    });
}
