import { create } from 'localisation';
export const LOCALES = ['en-AU', 'ja-JP'] as const;

const numFormatter = new Intl.NumberFormat();
const [t, trans, locale] = create(LOCALES[0], {
	'en-AU': {
		'yeah': 'svelte-localisation!!!',
		'yeah.awesome': 'wow!!!',

		'test1': 'hey look: $(test2~143, 1430000)',
		'test2': 'numbers... {0|number}... {1|number}...'
	}
}, LOCALES, {
	number: value => numFormatter.format(parseInt(value))
});

export { t, trans, locale };