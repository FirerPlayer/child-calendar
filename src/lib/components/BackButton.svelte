<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { navStack } from '$lib/stores';
	import { ArrowLeft } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';

	const goBack = () => {
		if ($page.route.id?.endsWith('login') || $page.route.id?.endsWith('registro')) {
			if (browser) {
				goto('/');
			}
		}
		if ($navStack.length <= 1) {
			if (browser) {
				goto('/');
			}
		}
		$navStack.pop();
		if (browser) {
			goto($navStack.pop() as string);
		}
	};
</script>

<button class="rounded-full" use:ripple on:click={goBack}>
	<ArrowLeft class="w-10 h-10 rounded-inherit" />
</button>
