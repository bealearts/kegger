import createTray from './tray/createTray.js';
// import createTrayIcon from './tray/createTrayIcon';
// import updateTray from './tray/updateTray';

try {

  await createTray();

} catch (error) {
  console.error(error);
}
