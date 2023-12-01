import { getLocalTimeZone } from '@internationalized/date';
import { readable, writable } from 'svelte/store';

export const navStack = readable<string[]>([]);
export const titleStore = writable<string>('Inicio');

export const localTimeZone = getLocalTimeZone();
