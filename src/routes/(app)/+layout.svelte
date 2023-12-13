<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pocketbase, userStores } from '$lib/stores';
	import { checkAuth } from '$lib/utils';
	import { onMount } from 'svelte';
	onMount(async () => {
		const user = await checkAuth();
		if (!user) {
			$pocketbase.authStore.clear();
			goto('/login');
		}
		userStores.set(user);
	});
</script>

<slot />
