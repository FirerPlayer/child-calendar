<script lang="ts">
	import ListRotinas from '$lib/components/ListRotinas.svelte';
	import MonthView, { type DateClickDetail } from '$lib/components/MonthView.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { localTimeZone, titleStore } from '$lib/stores';
	import { getTodayString } from '$lib/utils';
	import type { CalendarDate } from '@internationalized/date';

	import { createDialog, melt } from '@melt-ui/svelte';
	import { Plus, X } from 'svelte-bootstrap-icons';
	import { fade, fly } from 'svelte/transition';
	titleStore.set('Rotinas');
	let rotinaDrawerOpening = false;

	let currentDate: CalendarDate | undefined;
	const handleDateClick = (ev: CustomEvent) => {
		if (!rotinaDrawerOpening && !$open1) {
			rotinaDrawerOpening = true;
			open1.set(true);
		} else if (rotinaDrawerOpening && $open1) {
			return;
		} else {
			rotinaDrawerOpening = false;
			open1.set(false);
		}
		// open1.set(true);
		currentDate = (ev.detail as DateClickDetail).value;
	};
	const {
		elements: { portalled, overlay, content, title, close },
		states: { open: open1 }
	} = createDialog();
	// open1.set(true);

	const {
		elements: { portalled: portalled2, content: content2, title: title2, close: close2 },
		states: { open: open2 }
	} = createDialog();
</script>

<div use:melt={$portalled}>
	{#if $open1 && rotinaDrawerOpening}
		<div
			use:melt={$overlay}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>

		<div
			use:melt={$content}
			class="fixed left-0 top-0 z-50 h-screen w-full max-w-80% bg-bb-500 p-3
			shadow-lg focus:outline-none flex flex-col gap-2"
			transition:fly={{
				x: -350,
				duration: 300,
				opacity: 1
			}}
		>
			<div
				use:melt={$title}
				class="w-full bg-primary-500 rounded-4 p-2 px-5 shadow-md flex items-center justify-between"
			>
				<h1 class="text-3xl font-semibold text-center">Rotina</h1>
				{#if currentDate}
					<h2 class="text-xl text-center hidden md:block">
						{getTodayString(currentDate.toDate(localTimeZone))}
					</h2>
				{/if}
				<button
					use:melt={$close}
					on:m-click={() => {
						rotinaDrawerOpening = false;
					}}
					class="p-2 appearance-none items-center justify-center rounded-full text-primary-800
						hover:bg-primary-200 focus:shadow-primary-400 focus:outline-none focus:ring-2
						focus:ring-primary-400"
				>
					<X class="w-8 h-8 " />
				</button>
			</div>
			{#if currentDate}
				<h2
					class="text-xl md:hidden text-center w-full bg-primary-500 rounded-4 p-2 px-5 shadow-md"
				>
					{getTodayString(currentDate.toDate(localTimeZone))}
				</h2>
			{/if}
			<ListRotinas />
		</div>
	{/if}
</div>
<div use:melt={$portalled2}>
	{#if $open2}
		<div
			use:melt={$content2}
			class="fixed bottom-0 w-full h-40%
				z-50 bg-bb-500 p-3
			special-shadow focus:outline-none flex flex-col gap-2"
			transition:fly={{
				y: '100%',
				duration: 300
			}}
		>
			<div
				use:melt={$title2}
				class="w-full bg-primary-500 rounded-4 p-2 px-5 shadow-md flex items-center justify-between"
			>
				<h1 class="text-3xl font-semibold text-center">Criar uma rotina</h1>
				<button
					use:melt={$close2}
					class="p-2
						appearance-none items-center justify-center rounded-full text-primary-800
						hover:bg-primary-200 focus:shadow-primary-400 focus:outline-none focus:ring-2
						focus:ring-primary-400"
				>
					<X class="w-8 h-8 " />
				</button>
			</div>
			<div class="w-full bg-secondary-300 rounded-4 p-2 shadow-md flex-grow">oi</div>
		</div>
	{/if}
</div>

<TopBar />
<MonthView on:dateClick={handleDateClick} />
<button
	on:click={() => {
		rotinaDrawerOpening = true;
		open2.set(true);
	}}
	class="absolute top-10px right-10px p-2 rounded-full bg-primary-500"
>
	<Plus class="w-8 h-8" />
</button>

<style>
	.special-shadow {
		box-shadow:
			-20px -20px 60px #c8d5d9,
			20px 20px 60px #ffffff;
	}
</style>
