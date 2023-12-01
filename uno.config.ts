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
				100: '#fbfeff',
				200: '#f7fdff',
				300: '#f3fdff',
				400: '#effcff',
				500: '#ebfbff',
				600: '#bcc9cc',
				700: '#8d9799',
				800: '#5e6466',
				900: '#2f3233'
			},
			primary: {
				100: '#d9f7ff',
				200: '#b2effe',
				300: '#8ce7fe',
				400: '#65dffd',
				500: '#3fd7fd',
				600: '#32acca',
				700: '#268198',
				800: '#195665',
				900: '#0d2b33'
			},
			secondary: {
				100: '#f3fcff',
				200: '#e7faff',
				300: '#daf7fe',
				400: '#cef5fe',
				500: '#c2f2fe',
				600: '#9bc2cb',
				700: '#749198',
				800: '#4e6166',
				900: '#273033'
			},
			accent: {
				100: '#f7d7d0',
				200: '#f0b0a0',
				300: '#e88871',
				400: '#e16141',
				500: '#d93912',
				600: '#ae2e0e',
				700: '#82220b',
				800: '#571707',
				900: '#2b0b04'
			}
		}
	}
	// ...UnoCSS options
});
