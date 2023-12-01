<script lang="ts">
	import { titleStore } from '$lib/stores';
	import BackButton from './BackButton.svelte';

	export let className = 'flex gap-1 text-black rounded-br-6 p-2 top-0 left-0 bg-secondary-500';
</script>

<header class={className}>
	<BackButton />
	<h1 class="font-[ScholarlyAmbition] uppercase w-full text-center my-auto text-4xl">
		{$titleStore}
	</h1>
	<slot />
</header>
