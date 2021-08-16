import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

import backgroundTask from "../util/backgroundTask.js";
import updateableCount from "../brew/updateableCount.js";

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

    async updateDependenciesMenu(updates) {
      const count = updateableCount(updates);
      await this.updateMenuItem(1, {
        title: `${count} Updates Available`,
        enabled: count !== 0,
      });
      for (let index = 2; index <= 102; index++) {
        this.updateMenuItem(index, {
          hidden: true,
        });
      }
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
  console.log("msg", json);
  const line = textEncoder.encode(json + "\n");
  return await writer.write(line);
}
