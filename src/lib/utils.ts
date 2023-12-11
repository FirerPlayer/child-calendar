import { CalendarDate, DateFormatter } from '@internationalized/date';
import { localTimeZone, pocketbase } from './stores';
import { getContext, hasContext } from 'svelte';
import type Pocketbase from 'pocketbase';

export const getTodayString = (value: Date) =>
	new DateFormatter('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
export const hexToRgb = (hex: string): number[] => {
	return hex.match(/[A-Za-z0-9]{2}/g)!.map((v) => parseInt(v, 16));
};

// Converte o RGB para o formato CSS
export const rgbToCss = (rgb: number[]): string => {
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};
export function generateShades(hexColor: string): string[] {
	// Converte o valor hexadecimal para RGB

	const baseRgb = hexToRgb(hexColor);

	// Gera as 9 sombras (shades)
	const shades = Array.from({ length: 9 }, (_, index) => {
		const shadeValue = 100 - index * 10;
		const adjustedRgb = baseRgb.map((val) =>
			Math.max(0, Math.min(255, Math.round(val * (shadeValue / 100))))
		);
		return rgbToCss(adjustedRgb);
	});

	return shades;
}
