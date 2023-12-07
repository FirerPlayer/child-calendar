<script lang="ts">
	import { movable } from '$lib/actions';
	import { draggingState, offDragging, onDragging } from '$lib/stores';
	import { slide } from 'svelte/transition';
</script>

<div
	class="w-full bg-secondary-300 rounded-4 p-2 shadow-md
grid grid-cols-3 grid-flow-row md:grid-cols-5 gap-4 overflow-y-scroll rounded-4"
>
	{#each Array.from({ length: 20 }) as _, i}
		<div class="flex flex-col gap-2px items-center">
			<!-- use:draggable={{
					data: `rotina ${i}`
				}} -->
			<div use:movable class="border-(~ black) rounded-4 touch-none select-none">
				<img
					draggable="false"
					src="https://placehold.co/400"
					alt="rotina {i}"
					title="rotina {i}"
					class="rounded-inherit pointer-events-none"
				/>
			</div>
			{#if !$draggingState.on}
				<h3 transition:slide={{ duration: 500, axis: 'y' }}>Rotina {i}</h3>
			{/if}
		</div>
	{/each}
</div>
