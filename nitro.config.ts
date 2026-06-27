import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "node-server",
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});
