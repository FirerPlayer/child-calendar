<script lang="ts">
	import { draggable } from '$lib/actions';
	import { isDragging } from '$lib/stores';
	import { onMount } from 'svelte';

	let toucThresholdMs = 1000;
	let draggableDiv: HTMLElement;
	onMount(() => {
		draggableDiv.addEventListener('touchstart', (ev: TouchEvent) => {
			// ev.preventDefault();
			console.log('touchstart');
			console.log(ev.timeStamp);
		});
	});
</script>

<div
	class="w-full bg-secondary-300 rounded-4 p-2 shadow-md
grid grid-cols-3 grid-flow-row md:grid-cols-5 gap-4 overflow-y-scroll rounded-4"
>
	{#each Array.from({ length: 20 }) as _, i}
		<div
			bind:this={draggableDiv}
			use:draggable={{
				data: `rotina ${i}`
			}}
			class="border-(~ black) rounded-4"
		>
			<img
				draggable="false"
				src="https://placehold.co/400"
				alt="rotina {i}"
				title="rotina {i}"
				class="rounded-inherit"
			/>
		</div>
	{/each}
</div>
