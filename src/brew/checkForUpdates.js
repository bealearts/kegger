import updateBrew from "./updateBrew.js";
import listUpdates from "./listUpdates.js";

export default async function checkForUpdates(skipBrewUpdate = false) {
  if (skipBrewUpdate) {
    return listUpdates();
  }

  try {
    await updateBrew();
  } catch (error) {
    console.warn("Could not update Brew - Probably offline");
    console.warn(error);
  }

  return await listUpdates();
}
