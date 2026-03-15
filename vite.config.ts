import path from "node:path";
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
		rolldownOptions: {
			input: "src/module.ts",
			output: {
				entryFileNames: "module.mjs",
				chunkFileNames: "[name].mjs",
				codeSplitting: {
					groups: [
						{
							test: /node_modules\/jsx-dom/,
							name: "jsx-dom",
						},
					],
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
