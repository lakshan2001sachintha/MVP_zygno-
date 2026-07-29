import { lingui } from "@lingui/vite-plugin";
import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    lingui(),
    nitro({ rollupConfig: { external: [/^@sentry\//] }, preset: "node-server" }),
    tailwindcss(),
    tanstackStart(),
    sentryTanstackStart({
      org: process.env.VITE_SENTRY_ORG,
      project: process.env.VITE_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    viteReact(),
    babel({ plugins: ["@lingui/babel-plugin-lingui-macro"], presets: [reactCompilerPreset()] }),
  ],
});

export default config;
