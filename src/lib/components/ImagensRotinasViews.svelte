<script lang="ts">
	import { draggable } from '$lib/actions';
	import { draggingState } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import audioPick from '$lib/assets/pickSound.wav';
	import audioDrop from '$lib/assets/dropSound.wav';
	import { Howl } from 'howler';

	const pickSound = new Howl({
		src: [audioPick]
	});
	const dropSound = new Howl({
		src: [audioDrop]
	});

	let imagens = writable(
		Array.from({ length: 20 }).map((v, i) => ({
			id: i,
			src: `https://placehold.co/400`,
			title: `Rotina ${i}`
		}))
	);
</script>

<div
	class="w-full bg-secondary-300 rounded-4 p-2 shadow-md
grid grid-cols-3 grid-flow-row md:grid-cols-5 gap-4 overflow-y-scroll rounded-4"
>
	{#each $imagens as im, i (i)}
		<div class="flex flex-col gap-2px items-center">
			<div
				use:draggable={{
					data: { value: 'rotina ' + i },
					onDragstart(e) {
						pickSound.play();
					},
					onDragend(e) {
						dropSound.play();
					}
				}}
				class="border-(~ black) rounded-4 touch-none select-none"
			>
				<img
					draggable="false"
					src={im.src}
					alt={im.title}
					title={im.title}
					class="rounded-inherit pointer-events-none"
				/>
			</div>
			{#if !$draggingState.on}
				<h3 transition:slide={{ duration: 500, axis: 'y' }}>Rotina {i}</h3>
			{/if}
		</div>
	{/each}
</div>

<style>
	:global(.dragging) {
		--uno: shadow-accent-500;
		box-shadow: 0px 0px 8px 2px var(--un-shadow-color);
	}
</style>
