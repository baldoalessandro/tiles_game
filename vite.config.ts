/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";
// import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => {
  // Load the .env file
  // WARN: this will load all env vars and not only the ones prefixed with VITE_
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      /*
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin(),
      VitePWA({
        registerType: "prompt",
        includeAssets: [
          "favicon.ico",
          "favicon.svg",
          "apple-touch-icon.png",
          "mask-icon.svg",
        ],
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          description: env.VITE_APP_DESC,
          theme_color: env.VITE_APP_COLOR,
          orientation: "portrait",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    server: {
      port: 3000,
    },
    test: {
      environment: "jsdom",
      globals: true,
      transformMode: { web: [/\.[jt]sx?$/] },
      setupFiles: ["node_modules/@testing-library/jest-dom/extend-expect.js"],
      // otherwise, solid would be loaded twice:
      deps: { registerNodeLoader: true },
      // if you have few tests, try commenting one
      // or both out to improve performance:
      threads: false,
      isolate: false,
    },
    build: {
      target: "esnext",
    },
    resolve: {
      conditions: ["development", "browser"],
    },
  };
});
