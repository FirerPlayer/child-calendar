<script lang="ts">
	import { dropzone, type DropzoneOptions } from '$lib/actions';
	import type { DateValue } from '@internationalized/date';
	import { melt } from '@melt-ui/svelte';

	export let isDisabled: boolean;
	export let isToday: boolean;
	export let meltAction: any;
	export let handleClick: (e: MouseEvent | TouchEvent) => void;
	export let hasRotina: boolean | undefined;
	export let day: DateValue;
	export let monthWeeks: number = 6;
	export let dropzoneOptions: DropzoneOptions;
</script>

<td
	role="gridcell"
	aria-disabled={isDisabled}
	class="p-0 m-0 border-(t r black)"
	class:opacity-40={isDisabled}
>
	<!-- <div use:myCustomRipple> -->

	<button
		use:melt={meltAction}
		on:click|preventDefault={handleClick}
		use:dropzone={dropzoneOptions}
		style="height: calc(calc(100lvh - 168px)/{monthWeeks});"
		class:today={isToday}
		class="w-full h-full flex flex-col justify-between items-center transition-all duration-350"
	>
		<span
			class="font-semibold font-sans text-lg text-center
		pointer-events-none touch-none">{day.day}</span
		>
		{#if hasRotina}
			<h3
				class="bg-accent-500 text-white p-3 rounded-full text-sm
				text-black mb-3 font-semibold pointer-events-none touch-none"
			>
				<!-- {dayRotinas} -->
			</h3>
		{/if}
	</button>
	<!-- </div> -->
</td>

<style>
	.today {
		--uno: bg-primary-500/60 text-black;
	}
	.dragover-class {
		--uno: scale-110 z-50 ring-(2 accent-500) shadow-lg text-black bg-bb-300;
	}
</style>
