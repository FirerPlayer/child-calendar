<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { navStack } from '$lib/stores';
	import { ArrowLeft } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';

	const getPreviusUrl = () => {
		if ($navStack.length <= 1 || !$navStack.length) {
			return '/';
		}
		$navStack.pop();
		return $navStack.pop();
	};
</script>

<a href={getPreviusUrl()} class="rounded-full" use:ripple>
	<ArrowLeft class="w-10 h-10 rounded-inherit" />
</a>
