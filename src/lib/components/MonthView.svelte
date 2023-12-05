<script context="module" lang="ts">
	export type DateClickDetail = {
		value: CalendarDate;
	};
</script>

<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte';
	import { CalendarDate, isToday, today } from '@internationalized/date';
	import { ChevronRight, ChevronLeft } from 'svelte-bootstrap-icons';
	import { createEventDispatcher } from 'svelte';
	import { localTimeZone } from '$lib/stores';
	import DateCell from './DateCell.svelte';

	const onDateClickDispatch = createEventDispatcher();
	const onDateDragenterDispatch = createEventDispatcher();
	const onDateDragleaveDispatch = createEventDispatcher();
	const onDateDropDispatch = createEventDispatcher();

	function trueOrFalse(falseRate: number): boolean {
		const randomNum = Math.random(); // Gera um número aleatório entre 0 e 1

		// Compara o número gerado com a frequência desejada para false
		return randomNum > falseRate;
	}

	const {
		elements: { calendar, heading, grid, cell, prevButton, nextButton },
		states: { months, headingValue, daysOfWeek, value },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createCalendar({
		locale: 'pt-BR',
		defaultValue: today(localTimeZone),
		fixedWeeks: true
	});
</script>

<section class="h-[calc(100lvh-3.5rem)]">
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
					{$headingValue.split(' ')[0]}
				</h2>
				<button use:melt={$nextButton} class="p-4">
					<ChevronRight class="w-6 h-6" />
				</button>
			</header>
			<div class="">
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
										<DateCell
											{isDisabled}
											isToday={isToday(date, localTimeZone)}
											meltAction={$cell(date, month.value)}
											dayNumber={date.day}
											handleClick={(ev) => {
												onDateClickDispatch('dateClick', {
													value: date
												});
											}}
											dayRotinas={trueOrFalse(0.8) ? 3 : 0}
											dropzoneOptions={{
												dropEffect: 'move',
												onDropzone: (data, e) => {
													console.log(data + ' para o dia ' + date.day);
													onDateDropDispatch('dateDrop', {
														value: date
													});
												},
												onDragenter: (e) => {
													onDateDragenterDispatch('dateDragenter', {
														value: date
													});
												},
												onDragleave: (e) => {
													onDateDragleaveDispatch('dateDragleave', {
														value: date
													});
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
</section>

<style>
	.today {
		--uno: bg-primary-500/60 text-black;
	}
</style>
