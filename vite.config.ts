import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
export default {
	server: {
		fs: {
			allow: ['docs']
		}
	},
	plugins: [sveltekit()]
} satisfies UserConfig;