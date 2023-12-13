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
		<div class="grid grid-cols-3 grid-flow-row items-center place-content-start gap-5">
			{#each imgs as im, i (i)}
				<div class="flex flex-col gap-2px items-center">
					<div
						use:draggable={{
							data: { value: im },
							onDragstart(e) {
								pickSound.play();
							},
							onDragend(e) {
								dropSound.play();
							}
						}}
						class="border-(~ black) rounded-4 touch-none select-none w-28 h-28"
					>
						<img
							draggable="false"
							src={im.data}
							alt={im.nome}
							title={im.nome}
							class="rounded-inherit pointer-events-none w-28 h-28 object-cover"
						/>
					</div>
					{#if !$draggingState.on}
						<h3
							transition:slide={{ duration: 500, axis: 'y' }}
							class="max-w-20 overflow-hidden whitespace-nowrap text-ellipsis"
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

<!-- 
<script lang="ts">
	import { pocketbase } from '$lib/stores';
	import { ripple } from 'svelte-ripple-action';
	import LoaderSvg from './LoaderSVG.svelte';
	import type { RecordModel } from 'pocketbase';
	import { Image } from 'svelte-bootstrap-icons';
	type Imagem = {
		nome: string;
		data: string;
		created: string;
		updated: string;
	};

	const mapImagens = (v: RecordModel) => {
		return {
			...v,
			data: $pocketbase.files.getUrl(v, v.data),
			nome: v.nome as string
		};
	};
</script>

{#await $pocketbase.collection('imagens').getFullList({ sort: '-created' })}
	<div class="w-full h-full">
		<LoaderSvg class="w-12 h-12" />
	</div>
{:then imagens}
	{@const imgs = imagens.map(mapImagens)}
	{#if !imgs.length}
		<div class="w-full h-full">
			<Image class="w-20 h-20 opacity-40" />
			Sem imagens para exibir. Adicione mais
		</div>
	{:else}
		<div class="flex flex-col gap-4 flex-grow overflow-y-scroll">
			{#each imgs as im, i (i)}
				<div use:ripple class="flex gap-3 p-2 rounded-4 min-h-21 shadow-lg bg-primary-200">
					<img src={im.data} alt={im.nome} width="80" height="80" />
					<div class="flex flex-col gap-2px box-content">
						<h3 class="text-base font-semibold">Titulo da rotina</h3>
						<p class="text-sm w-full line-clamp-2 overflow-y-hidden text-ellipsis">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi quisquam odio natus
							dolore vero minus sint impedit, inventore numquam sequi laudantium, similique minima
							ipsum quaerat accusantium corporis obcaecati rerum deserunt!
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{:catch error}
	<h2 class="text-red">Algum erro ocorreu: <br /> {error}</h2>
{/await} -->

<!-- <div
	class="w-full bg-primary-100 rounded-4 p-2 shadow-md
grid grid-cols-3 grid-flow-row md:grid-cols-5 gap-4 overflow-y-scroll rounded-4"
>
	{#each $imagens as im, i (i)}
		<div class="flex flex-col gap-2px items-center">
			<div
				use:draggable={{
					data: { value: 'rotina ' + i },
					onDragstart(e) {
						pickSound.play();
					},
					onDragend(e) {
						dropSound.play();
					}
				}}
				class="border-(~ black) rounded-4 touch-none select-none"
			>
				<img
					draggable="false"
					src={im.src}
					alt={im.title}
					title={im.title}
					class="rounded-inherit pointer-events-none"
				/>
			</div>
			{#if !$draggingState.on}
				<h3 transition:slide={{ duration: 500, axis: 'y' }}>Rotina {i}</h3>
			{/if}
		</div>
	{/each}
</div> -->

<style>
	:global(.dragging) {
		--uno: shadow-accent-500;
		box-shadow: 0px 0px 8px 2px var(--un-shadow-color);
	}
</style>
