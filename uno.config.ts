// uno.config.ts
import {
	defineConfig,
	presetTypography,
	presetUno,
	presetWebFonts,
	presetAttributify
} from 'unocss';
// import presetIcons from '@unocss/preset-icons';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import extractorSvelte from '@unocss/extractor-svelte';
import { presetScrollbar } from 'unocss-preset-scrollbar';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [
		presetUno(),
		presetTypography(),
		presetWebFonts({
			fonts: {
				// these will extend the default theme
				sans: 'Roboto',
				mono: ['Fira Code', 'Fira Mono:400,700']
			}
		}),

		presetScrollbar(),
		presetAttributify()
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	extractors: [extractorSvelte()],
	theme: {
		colors: {
			text: {
				50: '#f7f0ee',
				100: '#efe1dc',
				200: '#dfc3b9',
				300: '#cfa596',
				400: '#bf8773',
				500: '#af6950',
				600: '#8c5440',
				700: '#693f30',
				800: '#462a20',
				900: '#231510',
				950: '#110b08'
			},
			background: {
				50: '#f2f2f2',
				100: '#e6e6e6',
				200: '#cccccc',
				300: '#b3b3b3',
				400: '#999999',
				500: '#808080',
				600: '#666666',
				700: '#4d4d4d',
				800: '#333333',
				900: '#1a1a1a',
				950: '#0d0d0d'
			},
			primary: {
				50: '#f0f7ee',
				100: '#e1efdc',
				200: '#c3deba',
				300: '#a5ce97',
				400: '#87be74',
				500: '#69ad52',
				600: '#548b41',
				700: '#3f6831',
				800: '#2a4521',
				900: '#152310',
				950: '#0a1108'
			},
			secondary: {
				50: '#f8ffe6',
				100: '#f0fecd',
				200: '#e1fd9b',
				300: '#d3fd68',
				400: '#c4fc36',
				500: '#b5fb04',
				600: '#91c903',
				700: '#6d9702',
				800: '#486402',
				900: '#243201',
				950: '#121900'
			},
			accent: {
				50: '#f8ffe6',
				100: '#f1fecd',
				200: '#e3fd9b',
				300: '#d5fd68',
				400: '#c7fc36',
				500: '#b9fb04',
				600: '#94c903',
				700: '#6f9702',
				800: '#4a6402',
				900: '#253201',
				950: '#131900'
			}
		}
	}
	// ...UnoCSS options
});
