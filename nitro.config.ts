import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  handlers: [
    {
      route: "/**",
      handler: "./routes/[...catchall].ts",
    },
  ],
  publicAssets: [
    {
      dir: "dist/client",
      maxAge: 3600,
    },
  ],
});
