const path = require('path')
module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-svelte-csf'],
	core: {
		builder: 'storybook-builder-vite'
	},
	svelteOptions: {
		preprocess: import('../svelte.config.js').preprocess
	},
	async viteFinal(config, { configType }) {
		// customize the Vite config here
    config.resolve.alias = {
      $app: path.resolve('./.svelte-kit/dev/runtime/app'),
      $graphql: path.resolve('./src/graphql'),
      $lib: path.resolve('./src/lib')
    };

		// return the customized config
		return config;
	}
};
