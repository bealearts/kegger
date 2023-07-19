import { encode } from "encoding/base64.ts";

export default async function createTrayIcon() {
  const icon = await Deno.readFile("./assets/kegTemplate.png");
  return encode(icon);
}
