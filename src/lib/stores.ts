import { getLocalTimeZone } from '@internationalized/date';
import { readable, writable } from 'svelte/store';
import Pocketbase from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public';

export const navStack = readable<string[]>([]);
export const titleStore = writable<string>('Inicio');

export const localTimeZone = getLocalTimeZone();

export const pocketbase = writable<Pocketbase>(new Pocketbase(PUBLIC_PB_URL));

export const isDragging = writable<boolean>(false);
