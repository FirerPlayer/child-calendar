<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pocketbase, userStores } from '$lib/stores';
	import { checkAuth } from '$lib/utils';
	import { onMount } from 'svelte';
	// page.subscribe(async (v) => {
	// });
	onMount(async () => {
		await checkAuth();
	});
</script>

<slot />
