const { nativeImage } = require('electron');
const path = require('path');

const assetsDirectory = path.join(__dirname, '../assets');

module.exports = function createTrayIcon() {
    return nativeImage.createFromPath(path.join(assetsDirectory, 'kegTemplate.png'));
}
