import { CalendarDate, DateFormatter, type DateValue } from '@internationalized/date';
import { getColors } from 'theme-colors';
import { DatePicker } from '@capacitor-community/date-picker';
import type { DatePickerTheme } from '@capacitor-community/date-picker';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { pocketbase } from './stores';
import { addToast } from './components/Toast.svelte';
import type { RecordModel } from 'pocketbase';

export const getDayRotinas = (rotinas: RecordModel[], day: DateValue): RecordModel[] => {
	const rotinasData = rotinas.filter((r) => {
		const d = new Date(r.dataInicio);

		return (
			d.getDate() === day.day && d.getMonth() + 1 === day.month && d.getFullYear() === day.year
		);
	});
	// if (rotinasData.length) console.log(rotinasData);
	return rotinasData;
};

export const getTodayString = (value: Date) =>
	new DateFormatter('pt-BR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(value);

export const getFormattedDate = (
	value: Date,
	opts: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}
) => new DateFormatter('pt-BR', opts).format(value);
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
	if (!localStorage.getItem('pocketbase_auth') || !pb.authStore.isValid) {
		pb.authStore.clear();
		await goto('/login');
		// return null;
	}
	try {
		await pb.collection('users').getOne(pb.authStore.model?.id, {
			requestKey: 'auth'
		});
	} catch (error) {
		addToast({
			title: 'Erro',
			message: 'Erro ao buscar perfil, talvez usuario não exista',
			type: 'error'
		});
		pb.authStore.clear();
		await goto('/login');
	}
};
export function isMobile(): boolean {
	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const logOut = () => {
	get(pocketbase).authStore.clear();
	goto('/login');
};

export function converterSegundosParaTempo(totalSegundos: number) {
	const horas = Math.floor(totalSegundos / 3600);
	const minutos = Math.floor((totalSegundos % 3600) / 60);
	const segundos = totalSegundos % 60;

	const formatoHora = `${horas.toString().padStart(2, '0')}:${minutos
		.toString()
		.padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

	return formatoHora;
}