import createTrayIcon from "./createTrayIcon.js";

export default function createDependenciesMenu() {
  const items = new Array(100).fill();
  return {
    title: "0 Updates Available",
    enabled: false,
    items: items.map(() => ({
      title: "",
      enabled: true,
      hidden: true,
    })),
  };
}
