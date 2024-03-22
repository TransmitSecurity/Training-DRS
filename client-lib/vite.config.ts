// vite.config.js
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      name: "ts-demo-server-lib",
      entry: ["./src/index.ts"],
      formats: ["es", "cjs"],
    },
    outDir: "lib",
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
      output: {
        preserveModules: true,
      },
    },
    target: "esnext", // transpile as little as possible
  },
  plugins: [dts()], // emit TS declaration files
});
