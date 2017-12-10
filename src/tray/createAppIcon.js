import { app, nativeImage } from 'electron';
import path from 'path';
import plist from 'simple-plist';
import { exec } from 'child_process';
import temp from 'temp';
import fs from 'fs-extra';

import getAppInfo from '../brew/getAppInfo';

export default async function createAppIcon(appInfo) {
    try {
        const appPath = getAppPath(appInfo);
        return getAppIcon(appPath);
    } catch (error) {
        return null;
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

    return `/Applications/${name.substr(0, index)}.app`;
}


async function getAppIcon(appPath) {
    const info = await readPlist(path.join(appPath, '/Contents/Info.plist'));

    const iconPath = info.CFBundleIconFile.includes('.icns') ? info.CFBundleIconFile : `${info.CFBundleIconFile}.icns`;

    return icnsToNativeImage(path.join(appPath, '/Contents/Resources/', iconPath));
}


const icnsToNativeImage = filePath => new Promise((resolve, reject) => {
    const tempPng = temp.path({ prefix: 'kegger', suffix: '.png' });
    exec(`sips -s format png -Z 16 ${filePath} --out ${tempPng}`, (error) => {
        if (error) {
            return reject(error);
        }

        const icon = resolve(nativeImage.createFromPath(tempPng));
        fs.unlink(tempPng);
        return icon;
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
