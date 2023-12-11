<script lang="ts">
	import ImagensRotinasViews from '$lib/components/ImagensRotinasViews.svelte';
	import ListRotinas from '$lib/components/ListRotinas.svelte';
	import MonthView, { type DateClickDetail } from '$lib/components/MonthView.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { draggingState, localTimeZone, titleStore } from '$lib/stores';
	import { getTodayString } from '$lib/utils';
	import type { CalendarDate } from '@internationalized/date';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { ArrowsMove, Plus, X } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { fade, fly } from 'svelte/transition';

	titleStore.set('Rotinas');
	// Local states

	let isMouseOutDrawer2 = false;

	let currentDate: CalendarDate | undefined;
	const handleDateClick = (ev: CustomEvent) => {
		if ($open2) {
			return;
		}
		open1.set(true);
		// openDrawer1();
		currentDate = (ev.detail as DateClickDetail).value;
	};

	const {
		elements: { portalled, overlay, content, title, close },
		states: { open: open1 }
	} = createDialog({
		closeOnOutsideClick: false
	});
	const {
		elements: {
			portalled: portalled2,
			overlay: overlay2,
			content: content2,
			title: title2,
			close: close2
		},
		states: { open: open2 }
	} = createDialog({
		closeOnOutsideClick: false,
		forceVisible: true
	});

	// Drawer states
</script>

<div use:melt={$portalled}>
	{#if $open1}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			use:melt={$overlay}
			on:click|preventDefault={(ev) => {
				open1.set(false);
			}}
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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div use:melt={$portalled2}>
	{#if $open2}
		<div
			use:melt={$overlay2}
			on:click|preventDefault={(ev) => {
				open1.set(false);
			}}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		>
			<h1 class="text-4xl text-white font-semibold text-center mt-35% max-w-80% mx-auto">
				Mova uma imagem para agendar
			</h1>
			<ArrowsMove class="w-28 h-28 text-white m-auto mt-5" />
		</div>
	{/if}
	<!-- {#if $open2} -->
	<div
		use:melt={$content2}
		on:dragleave={() => {
			open2.set(false);
		}}
		class="fixed bottom-0 w-full h-40% z-50 bg-bb-500 p-3
			focus:outline-none flex-(~ col) gap-2 border-(t-2 bb-600) transition-all duration-350"
		style="transform: translateY({$open2 ? '0' : '100%'});"
	>
		<!-- transition:fly={{
			y: '100%',
			duration: 300
		}} -->
		<div
			use:melt={$title2}
			class="w-full bg-primary-500 rounded-4 p-2 px-5 shadow-md flex items-center justify-between"
		>
			<h1 class="text-2xl font-semibold text-center">Criar uma rotina</h1>
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
		<ImagensRotinasViews />
	</div>
	<!-- {/if} -->
</div>

<TopBar>
	<h1>oi</h1>
</TopBar>
<MonthView
	on:dateClick={handleDateClick}
	on:dateDrop={(e) => {
		open2.set(true);
		console.log('aqui de fora');
		console.log($draggingState.data?.value);
		console.log(e.detail);
	}}
/>
<button
	on:click={() => {
		open2.set(true);
	}}
	class="fixed bottom-4 right-4 p-3 rounded-full bg-primary-500"
>
	<Plus class="w-9 h-9" />
</button>

<style>
	.special-shadow {
		box-shadow:
			-20px -20px 60px #c8d5d9,
			20px 20px 60px #ffffff;
	}
</style>
