import { nativeImage } from 'electron';
import path from 'path';
import plist from 'simple-plist';
import { exec } from 'child_process';

import getAppInfo from '../brew/getAppInfo';

const assetsDirectory = path.join(__dirname, '../assets');
const brewIcon = nativeImage.createFromPath(path.join(assetsDirectory, 'kegTemplate.png'));


export default async function createAppIcon(appName) {
    try {
        const appInfo = await getAppInfo(appName);
        const appPath = getAppPath(appInfo);
        return getAppIcon(appPath);
    } catch (error) {
        return brewIcon;
    }
}


function getAppPath(appInfo) {
    let index = 0;
    const name = appInfo.artifacts.find((artifact) => {
        index = artifact.indexOf('.app');
        if (index === -1) {
            index = artifact.indexOf('.pkg');
        }

        if (index === -1) {
            return false;
        }

        return true;
    });

    return `/Applications/${name.substr(0, index + 4)}`;
}


async function getAppIcon(appPath) {
    const info = await readPlist(path.join(appPath, '/Contents/Info.plist'));
    return icnsToNativeImage(path.join(appPath, '/Contents/Resources/', info.CFBundleIconFile));
}


const icnsToNativeImage = filePath => new Promise((resolve, reject) => {
    exec(`sips -s format png -Z 16 ${filePath} --out ./temp.png`, (error) => {
        if (error) {
            return reject(error);
        }

        return resolve(nativeImage.createFromPath('./temp.png'));
    });
});


const readPlist = filePath => new Promise((resolve, reject) => {
    plist.readFile(filePath, (error, result) => {
        if (error) {
            return reject(error);
        }

        return resolve(result);
    });
});
