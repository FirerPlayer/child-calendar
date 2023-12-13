<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';

	export let src: string | undefined = '';
	export let title = '';
	export let alt = '';
	export let classNameDiv = '';
	export let classNameImg = '';
	export let classNameFallbackDiv = '';

	if (!src) src = '';
	const {
		elements: { image, fallback }
	} = createAvatar({
		src
	});
</script>

<div class={classNameDiv}>
	<img use:melt={$image} {src} {title} {alt} class={classNameImg} />
	<div use:melt={$fallback} class={classNameFallbackDiv}>
		<slot />
	</div>
</div>
