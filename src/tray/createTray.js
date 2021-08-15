import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

import backgroundTask from "../util/backgroundTask.js";

const textEncoder = new TextEncoder();

export default function createTray() {
  let trayProcess;
  let onInit;
  const eventHandlers = new Map();

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
          const onClick = eventHandlers.get(id);
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
      eventHandlers.clear();
      const rawMenu = registerEventHandlers(eventHandlers, menu);
      return await sendMsg(trayProcess.stdin, rawMenu);
    },
  };
}

function registerEventHandlers(eventHandlers, menu) {
  if (menu.items && menu.items.length !== 0) {
    return {
      ...menu,
      items: menu.items.map(({ onClick, ...item }) => {
        item.__id = eventHandlers.size + 1;
        eventHandlers.set(item.__id, onClick);
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
