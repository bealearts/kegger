import execBrew from "./execBrew.js";

export default async function listUpdates() {
  const pinned = await execBrew("list --pinned");
  const outdated = await execBrew("outdated --verbose");

  return parse(pinned)(outdated);
}

function parse(pinned) {
  return (rows) =>
    rows.map(
      ((row) => {
        const [name, ...parts] = row.split(" ");
        return {
          name,
          info: parts.join(" "),
          isPinned: pinned.some((pin) => pin === name),
        };
      }),
    );
}
