<script lang="ts">
	import { createSlider, melt } from '@melt-ui/svelte';
	import { Pause, Play } from 'svelte-bootstrap-icons';
	import { writable } from 'svelte/store';
	import type { Howl } from 'howler';
	import { ripple } from 'svelte-ripple-action';

	export let title = 'Audio';
	export let audio: Howl;
	export let mainDivClass = '';
	let isPlaying = false;
	let value = writable([0]);
	const audioDuration = audio.duration();

	const {
		elements: { root, range, thumb }
	} = createSlider({
		defaultValue: [0],
		min: 0,
		max: 100,
		value,
		onValueChange: ({ curr, next }) => {
			if (!isPlaying) {
				audio.seek(audioDuration * (next[0] / 100));
			}
			return next;
		}
	});

	audio.on('play', () => {
		// Reference
		let updatedRaf: number | undefined;

		// Define a function to be run on every animation frame
		const onAnimationFrame = () => {
			// If the howl is still playing
			if (audio.playing()) {
				isPlaying = true;
				// Calculate the width
				const percentage = (audio.seek() / audio.duration()) * 100;
				if (audioDuration < 1 && 100 - percentage <= 8) {
					value.set([100]);
				} else {
					value.set([percentage]);
				}

				// Continue processing updates
				updatedRaf = requestAnimationFrame(onAnimationFrame);
			}

			// If the howl is no longer playing
			else {
				isPlaying = false;
				// value.set(0);
				// Stop processing updates
				if (updatedRaf) {
					cancelAnimationFrame(updatedRaf);
				}
			}
		};

		audio.on('end', () => {
			isPlaying = false;
			value.set([0]);
		});

		// Start processing updates
		updatedRaf = requestAnimationFrame(onAnimationFrame);
	});
</script>

<div class="flex-(~ col) gap-1 items-center justify-center w-full {mainDivClass}">
	<h3 class="font-medium text-ellipsis w-80% whitespace-nowrap overflow-hidden">{title}</h3>
	<div class="flex items-center w-full gap-4 px-2">
		{#if isPlaying}
			<button
				type="button"
				use:ripple
				on:click={() => audio.pause()}
				class="p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
			>
				<Pause class="w-8 h-8" />
			</button>
		{:else}
			<button
				type="button"
				use:ripple
				on:click={() => audio.play()}
				class="p-2 rounded-lg focus:ring-2 focus:ring-primary-500"
			>
				<Play class="w-8 h-8" />
			</button>
		{/if}
		<span use:melt={$root} class="relative flex h-4 w-full items-center">
			<span class="h-3 w-full bg-txt-500/40 rounded-full">
				<span use:melt={$range} class="h-full bg-primary-300" />
			</span>
			<span
				use:melt={$thumb()}
				class="h-8 w-8 rounded-full bg-primary-500 focus:ring-4 focus:!ring-black/40"
			/>
		</span>
	</div>
</div>

<style>
	span {
		pointer-events: all;
	}
</style>
