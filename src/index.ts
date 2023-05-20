import { get, derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

export type Values = Iterable<any> | Record<string, any>
export function translate(locale: string, key: string, values: Values, data: Record<string, Record<string, string>>, sourceLocale: string, processors: Record<string, (value: string, translate: (key: string, vars?: Values) => string) => string>) {
	let text: string = (data as any)[locale]?.[key] ?? (data as any)[sourceLocale]?.[key];
	if (typeof text !== 'string')
		return key;

	text = text.replaceAll(/{(.*?)}/g, (t: string, k: string) => {
		const split = k.split('|');
		const split2 = split[0].split('??');
		const formatType = split[1];

		let value = values as any;
		for (const name of split2[0].split('.'))
			value = value[name];
		
		let finalValue: string = value ?? split2[1] ?? t;
		const processor = processors[formatType];
		if (processor)
			finalValue = processor(finalValue, (key, vars) => translate(locale, key, vars ?? [], data, sourceLocale, processors));

		return finalValue;
	});
	text = text.replaceAll(/\$\((.*)\)/g, (_,match: string) => {
		const [key, values] = match.split('~');
		return translate(locale, key, values.split(', '), data, sourceLocale, processors);
	});

	return text;
}

export function create<L extends readonly string[], I extends string, D extends Record<I, Record<string, string>>>(initialLocale: I, data: D, _locales: L, processors: Record<string, (value: string, translate: (key: keyof D[I], vars?: Values) => string) => string> = {}): [Readable<(key: keyof D[I], vars?: Values) => string>, (key: keyof D[I], vars?: Values) => string, Writable<L[number]>] {
	const locale = writable(initialLocale as L[number]);
	const t = derived(locale, locale => (key: keyof D[I], vars: Values = []) =>
		translate(locale, key as string, vars, data, initialLocale, processors as any)
	);
	const trans = (key: keyof D[I], vars: Values = []) => translate(get(locale), key as string, vars, data, initialLocale, processors as any);
	return [t, trans, locale];
}