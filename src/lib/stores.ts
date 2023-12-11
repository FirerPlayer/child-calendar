import { getLocalTimeZone } from '@internationalized/date';
import { readable, writable } from 'svelte/store';
import Pocketbase from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public';

export const navStack = readable<string[]>([]);
export const titleStore = writable<string>('Inicio');

export const localTimeZone = getLocalTimeZone();

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

export const offDragging = () => {
	draggingState.update((state) => {
		state.on = false;
		return state;
	});
};
