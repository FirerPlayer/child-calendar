<script lang="ts">
	import { draggable } from '$lib/actions';
	import { appConfig, draggingState, pocketbase } from '$lib/stores';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	// import audioPick from '$lib/assets/pickSound.wav';
	import audioDrop from '$lib/assets/dropSound.wav';
	import { Howl } from 'howler';
	import type { RecordModel } from 'pocketbase';
	import LoaderSvg from './LoaderSVG.svelte';
	import { ripple } from 'svelte-ripple-action';
	import { Image } from 'svelte-bootstrap-icons';

	const audioPick = $appConfig.dragAndDropSound;
	const pickSound = new Howl({
		src: [audioPick]
	});
	const dropSound = new Howl({
		src: [audioDrop]
	});

	let imagens = writable(
		Array.from({ length: 20 }).map((v, i) => ({
			id: i,
			src: `https://placehold.co/400`,
			title: `Rotina ${i}`
		}))
	);
	const mapImagens = (v: RecordModel) => {
		return {
			...v,
			data: $pocketbase.files.getUrl(v, v.data),
			nome: v.nome as string
		};
	};
</script>

{#await $pocketbase.collection('imagens').getFullList({ sort: '-created' })}
	<div class="w-full h-full flex-(~ col) items-center justify-center">
		<LoaderSvg class="w-16 h-16" />
	</div>
{:then imagens}
	{@const imgs = imagens.map(mapImagens)}
	{#if !imgs.length}
		<div class="w-full h-full flex-(~ col) items-center justify-center">
			<Image class="w-20 h-20 opacity-40" />
			<h5 class="font-semibold text-center">Sem imagens para exibir. <br /> Adicione uma!</h5>
		</div>
	{:else}
		<div
			class="grid grid-cols-3 grid-flow-row items-center place-content-start
			gap-2 h-full w-full overflow-y-auto"
		>
			{#each imgs as im, i (i)}
				<div class="flex flex-col gap-2px items-center">
					<div
						use:draggable={{
							data: im,
							onDragstart(e) {
								pickSound.play();
							},
							onDragend(e) {
								dropSound.play();
							}
						}}
						class="border-(~ black) rounded-4 touch-none select-none w-26 h-26"
					>
						<img
							draggable="false"
							src={im.data}
							alt={im.nome}
							title={im.nome}
							class="rounded-inherit pointer-events-none w-26 h-26 object-cover"
						/>
					</div>
					{#if !$draggingState.on}
						<h3
							transition:slide={{ duration: 500, axis: 'y' }}
							class="max-w-20 overflow-hidden whitespace-nowrap text-ellipsis font-medium"
						>
							{im.nome}
						</h3>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{:catch error}
	<h2 class="text-red">Algum erro ocorreu: <br /> {error}</h2>
{/await}

<style>
	:global(#dragging) {
		--uno: shadow-accent-500;
		box-shadow: 0px 0px 8px 2px var(--un-shadow-color);
	}
</style>
