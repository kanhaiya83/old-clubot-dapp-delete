import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [
			react(),
			// nodePolyfills()
			VitePWA({
				strategies: 'injectManifest',
				srcDir: 'src',
				filename: 'sw.ts',
				registerType: 'autoUpdate',
				injectRegister: false,

				pwaAssets: {
					disabled: false,
					config: true,
				},

				manifest: {
					name: 'CluBot - Cluster Protocol',
					short_name: 'CluBot',
					description: 'I’m CluBot, your Cluster Protocol sidekick.',
					theme_color: '#9773d2',
				},

				injectManifest: {
					globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				},

				selfDestroying: true,
				devOptions: {
					enabled: true,
					navigateFallback: 'index.html',
					suppressWarnings: true,
					type: 'module',
				},
			})
		],
		resolve: {
			alias: {
				crypto: "empty-module",
				assert: "empty-module",
				http: "empty-module",
				https: "empty-module",
				os: "empty-module",
				url: "empty-module",
				zlib: "empty-module",
				stream: "empty-module",
				_stream_duplex: "empty-module",
				_stream_passthrough: "empty-module",
				_stream_readable: "empty-module",
				_stream_writable: "empty-module",
				_stream_transform: "empty-module",
			},
		},
		server: {
			host: '0.0.0.0',
		},
		define: {
			'process.env': process.env,
			global: "globalThis",
			__APP_ENV__: JSON.stringify(env.APP_ENV),
		},
		build: {
			target: 'esnext', // you can also use 'es2020' here
		},
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext', // you can also use 'es2020' here
			},
		},
	}
})
