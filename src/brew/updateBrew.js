import execBrew from "./execBrew.js";

export default function updateBrew() {
  return execBrew("update --quiet");
}
