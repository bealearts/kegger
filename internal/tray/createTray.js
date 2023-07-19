import { readLines } from "io/mod.ts";

import backgroundTask from "~/util/backgroundTask.js";
import updateableCount from "~/brew/updateableCount.js";
import execUpdate from "~/brew/execUpdate.js";

const textEncoder = new TextEncoder();

export default function createTray() {
  let trayProcess;
  let onInit;
  const menuMap = new Map();

  // deno-fmt-ignore
  backgroundTask(async () => {
    while (true) {
      console.info("Starting Tray process");
      trayProcess = Deno.run({
        cmd: ["./bin/tray_darwin"],
        env: {},
        stdout: "piped",
        stdin: "piped",
      });

      const msgInterator = readLines(trayProcess.stdout);
      await msgInterator.next();

      backgroundTask(async () => {
        for await (const msg of msgInterator) {
          const { __id: id } = JSON.parse(msg);
          const onClick = menuMap.get(id)?.onClick;
          if (onClick) {
            onClick(msg);
          } else {
            console.warn('No click handler for __id', id, msg);
          }
        }
      }).catch(console.error);

      if (onInit) {
        onInit();
      }

      await trayProcess.status();
      trayProcess.close();
    }
  }).catch(console.error);

  return {
    onInit(func) {
      onInit = func;
    },

    async setMenu(menu) {
      menuMap.clear();
      const rawMenu = registerEventHandlers(menuMap, menu);
      return await sendMsg(trayProcess.stdin, rawMenu);
    },

    async updateDependenciesMenu(updates = []) {
      const count = updateableCount(updates);
      await this.updateMenuItem(1, {
        title: `${count} Updates Available`,
        enabled: count !== 0,
      });

      const items = new Array(100).fill();
      const unPinned = updates.filter((item) => !item.isPinned);
      const pinned = updates.filter((item) => item.isPinned);

      await Promise.all(items.map((_, index) => {
        const update = unPinned[index];
        if (update) {
          return this.updateMenuItem(index + 2, {
            title: `${update.name} ${update.info}`,
            hidden: false,
            enabled: true,
            onClick: () => execUpdate(update.name),
          });
        }

        // TODO: Pinned seperator

        const pinnedUpdate = pinned[index - unPinned.length];
        if (pinnedUpdate) {
          return this.updateMenuItem(index + 2, {
            title: `${update.name} ${update.info}`,
            hidden: false,
            enabled: false,
            onClick: null,
          });
        }

        return this.updateMenuItem(index + 2, {
          title: "",
          hidden: true,
          onClick: null,
        });
      }));
    },

    async updateMenuItem(id, change) {
      const item = menuMap.get(id);
      const updatedItem = {
        ...item,
        ...change,
      };
      menuMap.set(id, updatedItem);
      return await sendMsg(trayProcess.stdin, {
        type: "update-item",
        item: updatedItem,
        seq_id: -1,
      });
    },
  };
}

function registerEventHandlers(eventHandlers, menu) {
  if (menu.items && menu.items.length !== 0) {
    return {
      ...menu,
      items: menu.items.map((item) => {
        item.__id = eventHandlers.size + 1;
        eventHandlers.set(item.__id, item);
        return registerEventHandlers(eventHandlers, item);
      }),
    };
  }

  return menu;
}

async function sendMsg(writer, msg) {
  const json = JSON.stringify(msg);
  const line = textEncoder.encode(json + "\n");
  return await writer.write(line);
}
