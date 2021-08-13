import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";

// mport createTrayMenu from './createTrayMenu';

export default async function createTray(trayIcon) {
  const trayProcess = Deno.run({
    cmd: ['./bin/tray_darwin_release'],
    env: {},
    stdout: 'piped',
    stdin: 'piped'
  });

  const interator = readLines(trayProcess.stdout);
  const ready = await interator.next();
  console.log(ready.value);

  const icon = await Deno.readFile('./assets/kegTemplate.png');

  const config = JSON.stringify({
    icon: btoa(icon),
    title: "Kegger",
    tooltip: "Kegger - Join the party",
    items: [{
      title: "About",
      enabled: true,
      icon: btoa(icon)
    }]
  });
  // console.log(config);

  var enc = new TextEncoder();
  await trayProcess.stdin.write(enc.encode(config + '\n'));
  await trayProcess.status();
  trayProcess.close();
}
