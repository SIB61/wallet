import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	optimizeDeps: {
		include: ["react-markdown", "remark-gfm"],
	},
	plugins: [
		devtools(),
		nitro({ preset: "vercel", rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: false,
			outDir: ".vercel/output/static",
			includeAssets: ["favicon.svg"],
			manifest: {
				name: "SIB61",
				short_name: "SIB61",
				description: "Portfolio, tools and apps",
				theme_color: "#4fb8b2",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				scope: "/",
				icons: [
					{
						src: "/pwa/icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa/icon-512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/pwa/maskable-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
				maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
			},
			devOptions: {
				enabled: false,
			},
		}),
		viteReact(),
	],
});

export default config;
