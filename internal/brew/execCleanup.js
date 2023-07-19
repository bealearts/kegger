import execTerminalScript from "~/util/execTerminalScript.js";

export default async function execCleanup() {
  console.info("Executing a Cleanup");
  await execTerminalScript(createScript());
}

const createScript = () =>
  `#!/bin/bash
echo Kegger - Join the party
echo
brew cleanup
echo
echo Cleanup Finished - There may be Errors listed above
read -n 1 -s -r -p "Press any key to close"
`;
