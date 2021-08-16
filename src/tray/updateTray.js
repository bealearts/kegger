import checkForUpdates from "../brew/checkForUpdates.js";
import updateableCount from "../brew/updateableCount.js";
import createTrayMenu from "./createTrayMenu.js";

export default async function updateTray(
  tray,
  skipBrewUpdate = false,
) {
  try {
    console.info("Performing update check");
    const updates = await checkForUpdates(skipBrewUpdate);
    const count = updateableCount(updates);
    // trayIcon.setTemplateImage(count === 0);
    // tray.setImage(trayIcon);
    tray.setMenu(createTrayMenu(updates));
  } catch (error) {
    console.error(error);
  }
}
