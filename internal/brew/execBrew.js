const textDecoder = new TextDecoder();

export default async function execBrew(args) {
  const brewProcess = Deno.run({
    cmd: ["brew", ...args.split(" ")],
    env: {},
    stdout: "piped",
    stdin: "piped",
    stderr: "piped",
  });

  const [status, output, error] = await Promise.all([
    brewProcess.status(),
    brewProcess.output(),
    brewProcess.stderrOutput(),
  ]);

  if (!status.success) {
    console.error(status);
    const errorString = textDecoder.decode(error);
    console.debug(errorString);
    throw new Error(errorString);
  }

  const result = textDecoder
    .decode(output)
    .split("\n")
    .filter((line) => line !== "");

  return result;
}
