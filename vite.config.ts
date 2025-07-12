import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            name: "fast-flip",
            entry: "src/module.ts",
            formats: ["es"],
            fileName: "module",
        },
        rollupOptions: {
            input: "src/module.ts",
            output: {
                entryFileNames: "module.mjs",
                chunkFileNames: "[name].mjs",
            },
        },
        target: "es2022",
    },
    plugins: [
        copy({
            targets: [{ src: "static/*", dest: "dist" }],
            hook: "writeBundle",
        }),
    ],
});
