<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'blaze-slider/dist/blaze.css';
	import 'virtual:uno.css';
	import 'svelte-ripple-action/ripple.css';
	import './app.css';
	import { page } from '$app/stores';
	import { navStack, pocketbase, titleStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import Toast, { addToast } from '$lib/components/Toast.svelte';
	page.subscribe((v) => {
		if (v.url.pathname === '/') {
			$navStack.push(v.url.pathname);
		}
	});

	onMount(async () => {
		await $pocketbase.health.check().catch((e) => {
			addToast({
				title: 'Erro',
				message: 'Erro ao conectar ao servidor',
				type: 'error'
			});
		});
		// if ($pocketbase.authStore.isValid) {

		// }
	});
</script>

<svelte:head>
	<title>{$titleStore + ' | ' + 'Child Calendar'}</title>
</svelte:head>

<!-- <svelte:window on:nav /> -->
<div class="min-w-screen text-txt-500 bg-bb-500">
	<Toast />
	<slot />
</div>
