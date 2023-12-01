<script lang="ts">
	import { ripple } from 'svelte-ripple-action';
</script>

<div class="flex flex-col gap-4 flex-grow overflow-y-scroll">
	{#each Array.from({ length: 18 }) as item, i}
		<div use:ripple class="flex gap-3 p-2 rounded-4 min-h-21 shadow-lg bg-primary-200">
			<img src="https://placehold.co/400" alt="Rotina" width="80" height="80" />
			<div class="flex flex-col gap-2px box-content">
				<h3 class="text-base font-semibold">Titulo da rotina</h3>
				<p class="text-sm w-full line-clamp-2 overflow-y-hidden text-ellipsis">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi quisquam odio natus
					dolore vero minus sint impedit, inventore numquam sequi laudantium, similique minima ipsum
					quaerat accusantium corporis obcaecati rerum deserunt!
				</p>
			</div>
		</div>
	{/each}
</div>
