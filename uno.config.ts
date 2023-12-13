// uno.config.ts
import { defineConfig, presetTypography, presetUno } from 'unocss';
// import presetIcons from '@unocss/preset-icons';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import extractorSvelte from '@unocss/extractor-svelte';
import { presetScrollbar } from 'unocss-preset-scrollbar';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [presetUno(), presetTypography(), presetScrollbar()],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	extractors: [extractorSvelte()],
	theme: {
		colors: {
			txt: {
				100: '#cccdcd',
				200: '#999b9b',
				300: '#666869',
				400: '#333637',
				500: '#000405',
				600: '#000304',
				700: '#000203',
				800: '#000202',
				900: '#000101'
			},
			bb: {
				100: '#fffefc',
				200: '#fefdf9',
				300: '#fefbf7',
				400: '#fdfaf4',
				500: '#fdf9f1',
				600: '#cac7c1',
				700: '#989591',
				800: '#656460',
				900: '#333230'
			},

			primary: {
				100: 'var(--primary-100)',
				200: 'var(--primary-200)',
				300: 'var(--primary-300)',
				400: 'var(--primary-400)',
				500: 'var(--primary-500)',
				600: 'var(--primary-600)',
				700: 'var(--primary-700)',
				800: 'var(--primary-800)',
				900: 'var(--primary-900)'
			},
			secondary: {
				50: 'rgb(236, 252, 233)',
				100: 'rgb(218, 248, 211)',
				200: 'rgb(180, 242, 166)',
				300: 'rgb(143, 235, 122)',
				400: 'rgb(105, 228, 78)',
				500: 'rgb(68, 222, 33)',
				600: 'rgb(54, 177, 27)',
				700: 'rgb(41, 133, 20)',
				800: 'rgb(27, 89, 13)',
				900: 'rgb(14, 44, 7)',
				950: 'rgb(7, 22, 3)'
			},
			accent: {
				100: '#ffe1cc',
				200: '#ffc299',
				300: '#ffa466',
				400: '#ff8533',
				500: '#ff6700',
				600: '#cc5200',
				700: '#993e00',
				800: '#662900',
				900: '#331500'
			}
		}
	}
	// ...UnoCSS options
});
