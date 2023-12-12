<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pocketbase } from '$lib/stores';
	import { checkAuth } from '$lib/utils';
	import { onMount } from 'svelte';
	onMount(async () => {
		await checkAuth();
	});
</script>

<slot />
