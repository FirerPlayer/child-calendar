<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { navStack } from '$lib/stores';
	import { ArrowLeft } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';

	const goBack = () => {
		if ($page.route.id?.endsWith('login') || $page.route.id?.endsWith('registro')) {
			goto('/');
		}
		if ($navStack.length <= 1) {
			goto('/');
		}
		$navStack.pop();
		goto($navStack.pop() as string);
	};
</script>

<button use:ripple on:click={goBack}>
	<ArrowLeft class="w-10 h-10" />
</button>
