import createTrayIcon from "./createTrayIcon.js";

const icon = await createTrayIcon();

export default function createTrayMenu(updates = []) {
  console.log(updates);
  const count = updates.length;
  return {
    icon: icon,
    tooltip: "Kegger - Join the party",
    items: [
      {
        title: `${count} Updates Available`,
        enabled: false,
      },
      {
        title: "Update All",
        __id: 2,
        enabled: count === 0,
      },
      {
        title: "Clean up Celler",
        __id: 1,
        enabled: true,
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
