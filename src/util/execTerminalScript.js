const updateScript = "./bin/update.sh";

export default async function execTerminalScript(script) {
  const tempScript = await Deno.makeTempFile({
    prefix: "kegger",
    suffix: ".sh",
  });
  await Deno.copyFile(updateScript, tempScript);
  await Deno.writeTextFile(tempScript, script);

  const terminalProcess = Deno.run({
    cmd: ["open", "-b", "com.apple.terminal", tempScript],
    env: {},
  });

  const status = await terminalProcess.status();
  // Deno.remove(tempScript);

  return status;
}
