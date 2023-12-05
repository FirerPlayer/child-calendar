import { CalendarDate, DateFormatter } from '@internationalized/date';
import { localTimeZone, pocketbase } from './stores';
import { getContext, hasContext } from 'svelte';
import type Pocketbase from 'pocketbase';

export const getTodayString = (value: Date) =>
	new DateFormatter('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
