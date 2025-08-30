import { fileURLToPath, URL } from 'node:url'

import { VitePWA } from 'vite-plugin-pwa';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				"name": "Album Balancer",
				"short_name": "Balancer",
				"start_url": "/album-balancer/",
				"display": "standalone",
				"background_color": "#fff",
				"theme_color": "#343434",
				"icons": [
					{
						"src": "images/icon-192.png",
						"sizes": "192x192",
						"type": "image/png"
					},
					{
						"src": "images/icon-512.png",
						"sizes": "512x512",
						"type": "image/png"
					}
				]
			}
		})
	],
	base: '/album-balancer/',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
