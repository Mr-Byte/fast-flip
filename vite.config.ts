import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";
import path from "path";

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
                compact: true,
                entryFileNames: "module.mjs",
                chunkFileNames: "[name].mjs",
                manualChunks: {
                    "jsx-dom": ["jsx-dom"],
                },
            },
        },
        target: "es2022",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    plugins: [
        copy({
            targets: [{ src: "static/*", dest: "dist" }],
            hook: "writeBundle",
        }),
    ],
});
