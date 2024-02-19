import createTrayIcon from "./createTrayIcon.js";
import createDependenciesMenu from "./createDependenciesMenu.js";
import execUpdate from "~/brew/execUpdate.js";
import execCleanup from "~/brew/execCleanup.js";

const icon = await createTrayIcon();

export default function createTrayMenu() {
  return {
    icon: icon,
    tooltip: "Kegger - Join the party",
    items: [
      createDependenciesMenu([]),
      {
        title: "Update All",
        enabled: false,
        onClick: () => execUpdate(),
      },
      {
        title: "Clean up Celler",
        enabled: true,
        onClick: () => execCleanup(),
      },
      {
        title: "<SEPARATOR>",
      },
      {
        title: "Preferences",
        enabled: true,
        items: [
          {
            title: "Start at login",
            enabled: true,
            checked: true,
          },
        ],
      },
      {
        title: "About",
        enabled: true,
      },
      {
        title: "<SEPARATOR>",
      },
      {
        title: "Quit",
        enabled: true,
        onClick: () => Deno.exit(),
      },
    ],
  };
}
