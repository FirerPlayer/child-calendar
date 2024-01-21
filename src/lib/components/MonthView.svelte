<script context="module" lang="ts">
	export type DateClickDetail = {
		date: CalendarDate;
		rotina: RecordModel;
	};

	export type DateDragFunction<T> = (ev: DragEvent, data?: T) => void;
</script>

<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte';
	import { CalendarDate, isToday, today, type DateValue } from '@internationalized/date';
	import { ChevronRight, ChevronLeft } from 'svelte-bootstrap-icons';
	import { createEventDispatcher } from 'svelte';
	import { localTimeZone, pocketbase } from '$lib/stores';
	import DateCell from './DateCell.svelte';
	import type { RecordModel } from 'pocketbase';
	import { getDayRotinas } from '$lib/utils';

	const onDateClickDispatch = createEventDispatcher();
	// const onDateDropDispatch = createEventDispatcher();
	export let dateDrop: (ev: DragEvent, data: DateValue) => void = (
		ev: DragEvent,
		data: DateValue
	) => {};

	// export let dateDragenter: DateDragFunction<DateValue> = (ev: DragEvent) => {};
	// export let dateDragleave: DateDragFunction<DateValue> = (ev: DragEvent) => {};

	// function trueOrFalse(falseRate: number): boolean {
	// 	const randomNum = Math.random(); // Gera um número aleatório entre 0 e 1

	// 	// Compara o número gerado com a frequência desejada para false
	// 	return randomNum > falseRate;
	// }
	export let rotinas: RecordModel[];
	// const rotinasDisplay: RotinaDisplay[] = [];

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		locale: 'pt-BR',
		defaultValue: today(localTimeZone),
		fixedWeeks: true
	});
	// let a = getDayRotinas(new CalendarDate(2023, 12, 8));
	// console.log(a);
</script>

<!-- <section class="h-[calc(100lvh-3.5rem)]"> -->
<div use:melt={$calendar} class="flex h-full">
	<div class="w-full h-full">
		<header class="flex justify-between items-center w-full">
			<button use:melt={$prevButton} class="p-4">
				<ChevronLeft class="w-6 h-6" />
			</button>
			<h2
				use:melt={$heading}
				class="w-full text-center text-2xl font-semibold font-sans capitalize"
			>
				{$headingValue.split(' ')[0]} - {$headingValue.split(' ')[2]}
			</h2>
			<button use:melt={$nextButton} class="p-4">
				<ChevronRight class="w-6 h-6" />
			</button>
		</header>
		<div>
			{#each $months as month}
				<table use:melt={$grid} class="w-full h-full">
					<thead aria-hidden="true">
						<tr>
							{#each $daysOfWeek as day}
								<th class="pb-2">
									<h3 class="shadow-md w-10 h-fit py-2 mx-auto rounded-full bg-primary-500">
										{day}
									</h3>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="max-w-screen overflow-hidden border-(l b black)">
						{#each month.weeks as weekDates}
							<tr>
								{#each weekDates as date}
									{@const isDisabled =
										$isDateDisabled(date) || $isDateUnavailable(date) ? true : false}
									{@const dayRotinas = getDayRotinas(rotinas, date)}
									<DateCell
										{isDisabled}
										isToday={isToday(date, localTimeZone)}
										meltAction={$cell(date, month.value)}
										day={date}
										handleClick={(ev) => {
											onDateClickDispatch('dateClick', {
												date: date,
												rotina: {}
											});
										}}
										hasRotina={dayRotinas.length != 0}
										dropzoneOptions={{
											dropEffect: 'move',
											onDrop: (e) => {
												dateDrop(e, date);
												// onDateDropDispatch('dateDrop', {
												// 	value: date
												// });
											},
											dragoverClass: 'dragover-class'
										}}
									/>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{/each}
		</div>
	</div>
</div>
<!-- </section> -->
