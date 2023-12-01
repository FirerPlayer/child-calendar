<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'blaze-slider/dist/blaze.css';
	import 'virtual:uno.css';
	import 'svelte-ripple-action/ripple.css';
	import './app.css';
	import { page } from '$app/stores';
	import { navStack, titleStore } from '$lib/stores';
	page.subscribe((v) => {
		$navStack.push(v.url.pathname);
	});
</script>

<svelte:head>
	<title>{$titleStore + ' | ' + 'Child Calendar'}</title>
</svelte:head>

<!-- <svelte:window on:nav /> -->
<div class="min-w-screen text-txt-500 bg-bb-500">
	<slot />
</div>
