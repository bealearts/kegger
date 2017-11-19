const { exec } = require('child_process');
const path = require('path');

const updateScript = path.join(__dirname, '../bin/update.sh');

module.exports = function execUpdate(name) {
    exec(`declare -x UPDATE_NAME="${name}"; open -b com.apple.terminal ${updateScript} -F`);
}
