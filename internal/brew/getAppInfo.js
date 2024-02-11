import execBrew from "./execBrew";

// brew info --json=v2 libreoffice

export default async function getAppInfo(appName) {
  const raw = await execBrew(`cask info ${appName}`);

  let nameNext = false;
  let artifactsNext = false;
  const info = raw.reduce(
    (obj, line) => {
      if (line === "==> Name") {
        nameNext = true;
      } else if (nameNext) {
        nameNext = false;
        return {
          ...obj,
          name: line,
        };
      } else if (line === "==> Artifacts") {
        artifactsNext = true;
      } else if (artifactsNext) {
        return {
          ...obj,
          artifacts: [...obj.artifacts, line],
        };
      }

      return obj;
    },
    {
      name: "",
      artifacts: [],
    }
  );

  return info;
}
