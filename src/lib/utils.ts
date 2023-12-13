import { CalendarDate, DateFormatter } from '@internationalized/date';
import { getColors } from 'theme-colors';
import { DatePicker } from '@capacitor-community/date-picker';
import type { DatePickerTheme } from '@capacitor-community/date-picker';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { pocketbase } from './stores';
import { addToast } from './components/Toast.svelte';
import { ClientResponseError } from 'pocketbase';

export const getTodayString = (value: Date) =>
	new DateFormatter('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
export const hexToRgb = (hex: string): number[] => {
	return hex.match(/[A-Za-z0-9]{2}/g)!.map((v) => parseInt(v, 16));
};

// Converte o RGB para o formato CSS
export const rgbToCss = (rgb: number[]): string => {
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};
export function generateShades(rgbColor: number[]) {
	const res = getColors(`${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}`);
	return res;
}

export const updateElementPrimaryColor = (element: HTMLElement, color: number[]) => {
	const shades = generateShades(color);

	Object.entries(shades).forEach(([k, v]) => {
		if (k == '950' || k == '50') {
			return;
		}
		element.style.setProperty(`--primary-${k}`, v);
	});
};

const selectedTheme: DatePickerTheme = 'light';
export const showNativeDatePicker = async (onDateSelected: (date: string) => void) => {
	await DatePicker.present({
		mode: 'date',
		locale: 'pt_BR',
		date: getTodayString(new Date()),
		theme: selectedTheme,
		ios: {
			format: 'dd/MM/yyyy'
		},
		android: {
			format: 'dd/MM/yyyy'
		}
	}).then(({ value }) => onDateSelected(value));
};

export const checkAuth = async () => {
	const pb = get(pocketbase);
	if (!pb.authStore.isValid) {
		// goto('/login');
		return null;
	}

	return await pb.collection('users').getOne(pb.authStore.model?.id);
};
export function isMobile(): boolean {
	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const logOut = () => {
	get(pocketbase).authStore.clear();
	goto('/login');
};
