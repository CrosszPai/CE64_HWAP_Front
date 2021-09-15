import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		vite: {
			server: {
				hmr: {
					port: 3333
				}
			},
			resolve: {
				dedupe: ['svelte', 'urql'],
				alias: {
					$graphql: path.resolve('./src/graphql')
				}
			},
			optimizeDeps: {
				exclude: ['cookie'],
				include: ['graphql']
			},
			ssr: {
				// Until https://github.com/vitejs/vite/issues/2579
				noExternal: [
					'@urql/exchange-request-policy',
					'@urql/svelte',
					'add',
					'daisyui',
					'graphql',
					'urql',
					'yarn'
				]
			}
		}
	}
};

export default config;