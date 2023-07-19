import execTerminalScript from "~/util/execTerminalScript.js";

export default async function execUpdate(name) {
  console.info("Executing an Update");
  await execTerminalScript(createScript(name));
}

const createScript = (name) =>
  `#!/bin/bash
echo Kegger - Join the party
echo
brew upgrade ${name ?? ""}
kill -SIGUSR2 ${Deno.pid} > /dev/null 2>&1 # Trigger Refresh
echo
echo Updated Finished - There may be Errors or further instructions listed above
read -n 1 -s -r -p "Press any key to close"
`;
