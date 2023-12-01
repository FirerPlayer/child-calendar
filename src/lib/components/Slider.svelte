<script lang="ts">
	import BlazeSlider from 'blaze-slider';
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';

	let divSlider: HTMLDivElement;
	let bs: BlazeSlider | null = null;
	export let className: string = '';
	export let withNavigation: boolean = false;
	$: clientWidth = 48;
	onMount(() => {
		bs = new BlazeSlider(divSlider);
		bs.onSlide(() => {});
	});
</script>

<div class="flex items-center">
	{#if withNavigation}
		<button use:ripple bind:clientWidth on:click|preventDefault={() => bs?.prev()} class="h-34 p-1">
			<ChevronLeft class="w-10 h-10" />
		</button>
	{/if}
	<div
		bind:this={divSlider}
		style="width: calc(100vw - {clientWidth * 2}px)"
		class="blaze-slider {className} a!w-[calc(100vw-6rem)]"
	>
		<div class="blaze-container">
			<div class="blaze-track-container">
				<div class="blaze-track">
					<slot>
						<div>1</div>
						<div>2</div>
						<div>3</div>
						<div>4</div>
					</slot>
				</div>
			</div>
		</div>
	</div>
	{#if withNavigation}
		<button use:ripple on:click|preventDefault={() => bs?.next()} class="h-34 p-1">
			<ChevronRight class="w-10 h-10" />
		</button>
	{/if}
</div>
