import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

import backgroundTask from "../util/backgroundTask.js";

const textEncoder = new TextEncoder();

export default function createTray() {
  let trayProcess;
  let onInit;

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
          console.log(msg);
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
      const rawMenu = registerHandlers(menu);
      return await sendMsg(trayProcess.stdin, rawMenu);
    },
  };
}

function registerHandlers(menu) {
  return menu;
}

async function sendMsg(writer, msg) {
  const json = JSON.stringify(msg);
  const line = textEncoder.encode(json + "\n");
  return await writer.write(line);
}
