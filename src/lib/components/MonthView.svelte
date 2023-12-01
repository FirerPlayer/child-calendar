<script context="module" lang="ts">
	export type DateClickDetail = {
		value: CalendarDate;
	};
</script>

<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte';
	import { CalendarDate, isToday, today } from '@internationalized/date';
	import { ChevronRight, ChevronLeft } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { createEventDispatcher } from 'svelte';
	import { localTimeZone } from '$lib/stores';

	const onDateClickDispatch = createEventDispatcher();

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
		// preventDeselect: true
	});

	// value.subscribe((v) => {
	// 	if (!v || !$value) {
	// 		return;
	// 	}
	// 	onDateClickDispatch('dateClick', {
	// 		value: v
	// 	} satisfies DateClickDetail);
	// });
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
										{@const isDisabled = $isDateDisabled(date) || $isDateUnavailable(date)}
										<td
											role="gridcell"
											aria-disabled={isDisabled}
											class="p-0 m-0 border-(t r black)"
											class:opacity-40={isDisabled}
											use:ripple
										>
											<button
												style="height: calc(calc(100lvh - 168px)/{month.weeks.length});"
												use:melt={$cell(date, month.value)}
												class:today={isToday(date, localTimeZone)}
												on:click|preventDefault={(ev) => {
													onDateClickDispatch('dateClick', {
														value: date
													});
												}}
												class="w-full h-full flex flex-col justify-between items-center"
											>
												<span class="font-semibold font-sans text-lg text-center">{date.day}</span>
												{#if trueOrFalse(0.8)}
													<h3
														class="bg-accent-500 text-white px-2 py-1 rounded-full text-sm text-black mb-3 font-semibold"
													>
														3
													</h3>
													<!-- <CircleFill class="w-3 h-3 fill-accent-500 mx-auto w-fit mb-3" /> -->
												{/if}
											</button>
										</td>
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
