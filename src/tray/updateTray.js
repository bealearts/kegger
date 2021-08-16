import checkForUpdates from "../brew/checkForUpdates.js";
import updateableCount from "../brew/updateableCount.js";
import createDependenciesMenu from "./createDependenciesMenu.js";

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
    await tray.updateDependenciesMenu(updates);
    await tray.updateMenuItem(102, {
      enabled: count !== 0,
    });
  } catch (error) {
    console.error(error);
  }
}
