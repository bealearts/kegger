import { nativeImage } from 'electron';
import path from 'path';

const assetsDirectory = path.join(__dirname, '../assets');

export default function createTrayIcon() {
    return nativeImage.createFromPath(path.join(assetsDirectory, 'kegTemplate.png'));
}
