import { encode } from "https://deno.land/std@0.104.0/encoding/base64.ts";

export default async function createTrayIcon() {
  const icon = await Deno.readFile("./assets/kegTemplate.png");
  return encode(icon);
}
