import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

const textEncoder = new TextEncoder()

export default async function createTray() {
  let trayProcess;
  let onInit;

  new Promise(async () => {
    while(true) {
      console.info('Starting Tray process');
      trayProcess = Deno.run({
        cmd: ['./bin/tray_darwin'],
        env: {},
        stdout: 'piped',
        stdin: 'piped'
      });

      const msgInterator = readLines(trayProcess.stdout)
      await msgInterator.next();

      new Promise(async () => {
        for await (const msg of msgInterator) {
          console.log(msg);
        }
      });

      if (onInit) {
        onInit();
      }
      
      await trayProcess.status();
      trayProcess.close();
    }
  })


  return {
    onInit(func) {
      onInit = func;
    },

    async setMenu(menu) {
      return sendMsg(trayProcess.stdin, menu);
    }
  }
}


async function sendMsg(writer, msg) {
  const json = JSON.stringify(msg);
  const line = textEncoder.encode(json + '\n');
  return writer.write(line);
}
