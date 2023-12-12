<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let src = '';
	export let title = '';
	export let alt = '';
	export let className = '';
	export let classNameFallbackDiv = '';

	const {
		elements: { image, fallback }
	} = createAvatar({
		src
	});
</script>

<div>
	<img use:melt={$image} {src} {title} {alt} class={className} />
	<div use:melt={$fallback} class={classNameFallbackDiv}>
		<slot />
	</div>
</div>
