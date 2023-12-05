<script lang="ts">
	import { goto } from '$app/navigation';
	import { pocketbase } from '$lib/stores';
	if (!$pocketbase.authStore.isValid) {
		goto('/login');
	}
</script>

<slot />
