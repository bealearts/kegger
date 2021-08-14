import createTray from "./tray/createTray.js";
import createTrayMenu from "./tray/createTrayMenu.js";
// import updateTray from './tray/updateTray';

try {
  const tray = createTray();
  tray.onInit(() => {
    tray.setMenu(createTrayMenu());
  });

  setInterval(() => updateTray(tray), 60 * 60 * 1000);
} catch (error) {
  console.error(error);
}

function updateTray() {
  console.log("Update - TODO");
}
