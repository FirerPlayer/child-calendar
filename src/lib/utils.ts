import { CalendarDate, DateFormatter } from '@internationalized/date';
import { localTimeZone } from './stores';

export const getTodayString = (value: Date) =>
	new DateFormatter('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(value);
