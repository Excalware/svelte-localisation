import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		alias: {
			localisation: 'src'
		},
		files: {
			lib: 'src',
			assets: 'docs/static',
			routes: 'docs/routes',
			appTemplate: 'docs/app.html'
		},
		adapter: adapter()
	},
	preprocess: [vitePreprocess()]
};