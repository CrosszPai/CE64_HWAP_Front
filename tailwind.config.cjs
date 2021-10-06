const tw = require('tailwindcss/lib/lib/purgeUnusedStyles');
const config = {
	mode: 'jit',
	purge: {
		enable: true,
		content: ['./src/**/*.{html,js,svelte,ts}'],
		defaultExtractor: (content) => [
			...tw.tailwindExtractor(content),
			...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
			...(content.match(/(?<=class:)[^=>\/\s]*/g) || [])
		]
	},
	theme: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/typography'), 
		require('daisyui')
	]
};

module.exports = config;
