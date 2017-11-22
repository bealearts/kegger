import fs from 'fs-extra';
import path from 'path';

export default async function createAppIcon(appPath) {
    const plist = await fs.readJson(path.join(appPath, '/Contents/Info.plist'));
}
