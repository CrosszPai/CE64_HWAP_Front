import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
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
		adapter: vercel(),
		vite: {
			resolve: {
				dedupe: ['svelte', 'urql'],
				alias: {
					$graphql: path.resolve('./src/graphql'),
					$components: path.resolve('./src/components')
				}
			},
			optimizeDeps: {
				exclude: ['cookie', 'dayjs', '@urql/svelte', 'github-buttons'],
				include: ['graphql']
			},
			ssr: {
				// Until https://github.com/vitejs/vite/issues/2579
				noExternal: [
					'@urql/exchange-request-policy',
					'add',
					'daisyui',
					'github-buttons',
					'graphql',
					'urql',
					'yarn',
					'dayjs',
					...(process.env.NODE_ENV === 'production' ? ['@urql/svelte'] : [])
				]
			}
		}
	}
};

export default config;
