import { getLocalTimeZone } from '@internationalized/date';
import { get, readable, writable } from 'svelte/store';
import Pocketbase from 'pocketbase';
import { ClientResponseError } from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public';
import pickSound from '$lib/assets/pickSound.wav';
import { isMobile, updateElementPrimaryColor } from './utils';

export const navStack = readable<string[]>([]);
export const titleStore = writable<string>('Inicio');

export const localTimeZone = getLocalTimeZone();
export const isMobileDevie = isMobile();

export const pocketbase = readable<Pocketbase>(new Pocketbase(PUBLIC_PB_URL));

export const draggingState = writable<{ on: boolean; data?: Record<string, any> }>({
	on: false
});

export const onDragging = (data?: Record<string, any>) => {
	draggingState.update((state) => {
		state.on = true;
		state.data = data;
		return state;
	});
};

export type AppConfig = {
	preferedColor: number[];
	dragAndDropSound: string;
	showClockOnRotinaStart: boolean;
};
export let defaultConfig: AppConfig = {
	preferedColor: [63, 215, 253],
	dragAndDropSound: pickSound,
	showClockOnRotinaStart: true
};
export let initalConfig: AppConfig = defaultConfig;

if (
	!localStorage.getItem('appConfig') ||
	localStorage.getItem('appConfig') === null ||
	localStorage.getItem('appConfig') === '{}'
) {
	localStorage.setItem('appConfig', JSON.stringify(defaultConfig));
} else {
	initalConfig = JSON.parse(localStorage.getItem('appConfig')!);
}

export const saveConfig = (config: AppConfig) => {
	localStorage.setItem('appConfig', JSON.stringify(config));
	appConfig.set(config);
};

export const appConfig = writable<AppConfig>(initalConfig);

// localStorage.setItem('appConfig', JSON.stringify({}));

export const offDragging = () => {
	draggingState.update((state) => {
		state.on = false;
		return state;
	});
};
// export const preferedColor = writable<number[]>(initalConfig.preferedColor);

// preferedColor.subscribe((value) => {
// 	updateElementPrimaryColor(value);
// });
