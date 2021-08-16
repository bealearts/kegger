import createTray from "./tray/createTray.js";
import createTrayMenu from "./tray/createTrayMenu.js";
import updateTray from "./tray/updateTray.js";

try {
  const tray = createTray();
  tray.onInit(() => {
    tray.setMenu(createTrayMenu());
    tray.updateDependenciesMenu([]);
    updateTray(tray);
  });

  setInterval(() => updateTray(tray), 60 * 60 * 1000);
} catch (error) {
  console.error(error);
}
