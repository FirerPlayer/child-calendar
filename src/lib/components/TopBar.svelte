<script lang="ts">
	import { titleStore } from '$lib/stores';
	import BackButton from './BackButton.svelte';

	export let className =
		'flex items-center gap-1 text-black rounded-br-6 p-2 top-0 left-0 bg-primary-500';
	export let backCallback: (() => string) | undefined = undefined;
</script>

<header class={className}>
	<BackButton {backCallback} />
	<h1 class="font-[ScholarlyAmbition] uppercase w-full text-center my-auto text-4xl">
		{$titleStore}
	</h1>
	<slot />
</header>
