import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";
import { encode } from "https://deno.land/std@0.104.0/encoding/base64.ts"

// mport createTrayMenu from './createTrayMenu';

export default async function createTray(trayIcon) {
  const trayProcess = Deno.run({
    cmd: ['./bin/tray_darwin'],
    env: {},
    stdout: 'piped',
    stdin: 'piped'
  });

  const interator = readLines(trayProcess.stdout);
  const ready = await interator.next();
  console.log(ready.value);

  const icon = await Deno.readFile('./assets/kegTemplate.png');

  const config = JSON.stringify({
    icon: encode(icon),
    tooltip: "Kegger - Join the party",
    items: [
      {
        title: "0 Updates Available",
        enabled: false
      },
      {
        title: "Update All",
        enabled: false
      },
      {
        title: "Clean up Celler",
        enabled: true
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
            checked: true
          }
        ]
      },
      {
        title: "About",
        enabled: true
      },
      {
        title: "<SEPARATOR>",
      },
      {
        title: "Quit",
        enabled: true
      }
    ]
  });

  var enc = new TextEncoder();
  await trayProcess.stdin.write(enc.encode(config + '\n'));
  await trayProcess.status();
  trayProcess.close();
}
