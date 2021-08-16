const updateScript = "./bin/update.sh";

const textEncoder = new TextEncoder();

export default async function execUpdate(name) {
  // const tempScript = temp.path({ prefix: "kegger", suffix: ".sh" });
  // await fs.copy(updateScript, tempScript);
  // await fs.writeFile(tempScript, createScript(name));
  const tempScript = "./bin/temp.sh";
  await Deno.copyFile(updateScript, tempScript);
  await Deno.writeFile(tempScript, textEncoder.encode(createScript(name)));

  const terminalProcess = Deno.run({
    cmd: ["open", "-b", "com.apple.terminal", tempScript],
    env: {},
  });

  await terminalProcess.status();
}

const createScript = (name, tempScript) =>
  `#!/bin/bash
echo Kegger - Join the party
echo
brew upgrade ${name ?? ""}
echo
echo Updated Finished - There may be Errors or further instructions listed above
read -n 1 -s -r -p "Press any key to close"
rm -f ${tempScript}
`;
