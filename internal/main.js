import createTray from "./tray/createTray.js";
import createTrayMenu from "./tray/createTrayMenu.js";
import updateTray from "./tray/updateTray.js";

try {
  const tray = createTray();
  tray.onInit(() => {
    tray.setMenu(createTrayMenu());
    tray.updateDependenciesMenu([]);
    updateTray(tray, true);
  });

  setInterval(() => updateTray(tray), 60 * 60 * 1000);

  // Callback signal from the update script
  for await (const _ of Deno.signal(Deno.Signal.SIGUSR2)) {
    updateTray(tray, true);
  }
} catch (error) {
  console.error(error);
}
