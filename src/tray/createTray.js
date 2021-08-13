import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

import createTrayMenu from './createTrayMenu.js';

const textEncoder = new TextEncoder()

export default async function createTray() {
  const trayProcess = Deno.run({
    cmd: ['./bin/tray_darwin'],
    env: {},
    stdout: 'piped',
    stdin: 'piped'
  });

  const menu = createTrayMenu();

  const msgInterator = readLines(trayProcess.stdout)
  const ready = await msgInterator.next();

  await sendMsg(trayProcess.stdin, menu);

  new Promise(async () => {
    for await (const msg of msgInterator) {
      console.log(msg);
    }
  });

  await trayProcess.status();
  trayProcess.close();
}


async function sendMsg(writer, msg) {
  const json = JSON.stringify(msg);
  const line = textEncoder.encode(json + '\n');
  return writer.write(line);
}
