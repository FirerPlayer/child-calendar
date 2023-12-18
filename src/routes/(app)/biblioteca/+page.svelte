<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { pocketbase, titleStore } from '$lib/stores';
	import { createDialog, createTabs, melt } from '@melt-ui/svelte';
	import { FileEarmarkPlus, Image, MusicNoteBeamed, X } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { Howl } from 'howler';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade, fade, fly } from 'svelte/transition';
	import audioPick from '$lib/assets/pickSound.wav';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';
	import FormCriarMidia from '$lib/components/FormCriarMidia.svelte';
	import LoaderSvg from '$lib/components/LoaderSVG.svelte';
	import type { RecordModel } from 'pocketbase';
	// import BiggerPicture from 'bigger-picture/svelte';

	titleStore.set('Biblioteca');

	const {
		elements: { root, list, content, trigger },
		states: { value: currTab }
	} = createTabs({
		defaultValue: 'imagens'
	});

	const triggers = [
		{ id: 'imagens', title: 'Imagens' },
		{ id: 'sons', title: 'Sons' }
	];

	const [send, receive] = crossfade({
		duration: 800,
		easing: cubicInOut
	});

	const {
		elements: { portalled, overlay, content: dialogContent, title, close },
		states: { open }
	} = createDialog({
		closeOnOutsideClick: false
	});
	const mapFiles = (v: RecordModel) => {
		return {
			...v,
			data: $pocketbase.files.getUrl(v, v.data),
			nome: v.nome as string
		};
	};

	let hasSubmited = false;
	let handleAfterSubmit = () => {
		open.set(false);
		hasSubmited = true;
	};
</script>

<div use:melt={$portalled}>
	{#if $open}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			use:melt={$overlay}
			on:click|preventDefault={(ev) => {
				open.set(false);
			}}
			class="fixed inset-0 z-50 bg-black/50"
			transition:fade={{ duration: 150 }}
		/>

		<div
			use:melt={$dialogContent}
			class="fixed left-0 top-0 z-50 h-screen w-full max-w-80% bg-bb-500 p-3
			shadow-lg focus:outline-none flex flex-col gap-2"
			transition:fly={{
				x: -350,
				duration: 300,
				opacity: 1
			}}
		>
			<div
				use:melt={$title}
				class="w-full bg-primary-500 rounded-4 p-2 px-5 shadow-md flex items-center justify-between"
			>
				<h1 class="text-2xl font-semibold text-center">
					{$currTab === 'imagens' ? 'Nova imagem' : 'Novo som'}
				</h1>
				<button
					use:melt={$close}
					class="p-2 appearance-none items-center justify-center rounded-full text-primary-800
						hover:bg-primary-200 focus:shadow-primary-400 focus:outline-none focus:ring-2
						focus:ring-primary-400"
				>
					<X class="w-8 h-8 " />
				</button>
			</div>
			<FormCriarMidia midiaType={$currTab} afterSubmit={handleAfterSubmit} />
		</div>
	{/if}
</div>

<TopBar>
	<button
		use:ripple
		on:click={() => {
			open.set(true);
			hasSubmited = false;
		}}
		class="focus:ring-2 focus:ring-primary-500 px-3 py-2 flex items-center rounded-full"
	>
		<FileEarmarkPlus class="w-9 h-9" />
	</button>
</TopBar>
<div
	use:melt={$root}
	class="w-full h-full flex flex-col overflow-hidden shadow-lg data-[orientation=vertical]:flex-row"
>
	<!-- imagens -->
	<div use:melt={$content('imagens')} class="bg-bb-500 p-3 h-[calc(100svh-6.5rem)]">
		{#key hasSubmited}
			{#await $pocketbase.collection('imagens').getFullList({ sort: '-created' })}
				<div class="w-full h-full flex-(~ col) items-center justify-center">
					<LoaderSvg class="w-16 h-16" />
				</div>
			{:then imagens}
				{@const imgs = imagens.map(mapFiles)}
				{#if !imgs.length}
					<div class="w-full h-full flex-(~ col) items-center justify-center">
						<Image class="w-20 h-20 opacity-40" />
						<h5 class="font-semibold text-center">Sem imagens para exibir. <br /> Adicione uma!</h5>
					</div>
				{:else}
					<div
						class="grid grid-cols-2 md:grid-cols-4 grid-flow-row items-center place-content-start
				gap-5 overflow-y-auto h-full"
					>
						{#each imgs as im, i (i)}
							<div class="flex-(~ col) gap-1 items-center">
								<img
									draggable="false"
									src={im.data}
									alt={im.nome}
									title={im.nome}
									class="object-cover w-36 h-36 md:w-42 md:h-42"
								/>

								<h3 class="font-medium max-w-20 overflow-hidden whitespace-nowrap text-ellipsis">
									{im.nome}
								</h3>
							</div>
						{/each}
					</div>
				{/if}
			{:catch error}
				<h2 class="text-red">Algum erro ocorreu: <br /> {error}</h2>
			{/await}
		{/key}
	</div>
	<!-- sons -->
	<div use:melt={$content('sons')} class="h-[calc(100svh-6.5rem)] bg-bb-500 p-3">
		{#key hasSubmited}
			{#await $pocketbase.collection('sons').getFullList({ sort: '-created' })}
				<div class="w-full h-full flex-(~ col) items-center justify-center">
					<LoaderSvg class="w-16 h-16" />
				</div>
			{:then sons}
				{@const audios = sons.map(mapFiles)}
				{#if !audios.length}
					<div class="w-full h-full flex-(~ col) items-center justify-center">
						<MusicNoteBeamed class="w-20 h-20 opacity-40" />
						<h5 class="font-semibold text-center">Sem sons para exibir. <br /> Adicione um!</h5>
					</div>
				{:else}
					{#each audios as aud, i (i)}
						<MusicPlayer title={aud.nome} audio={new Howl({ src: aud.data })} />
					{/each}
				{/if}
			{:catch error}
				<h2 class="text-red">Algum erro ocorreu: <br /> {error}</h2>
			{/await}
		{/key}
	</div>

	<div
		use:melt={$list}
		class="fixed bottom-0 w-100lvw flex shrink-0 overflow-hidden bag-bb-500
    data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r bg-transparent"
		aria-label="Biblioteca de imagens e sons"
	>
		{#each triggers as triggerItem}
			<button
				use:melt={$trigger(triggerItem.id)}
				use:ripple
				class="relative flex items-center justify-center bg-neutral-100 font-bold focus-visible:z-10
				focus-visible:ring-2 focus-visible:ring-primary-500 p-2 h-12 w-full text-xl"
			>
				{#if $currTab === triggerItem.id}
					<div
						in:send={{ key: 'trigger' }}
						out:receive={{ key: 'trigger' }}
						class="absolute top-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-primary-400"
					/>
				{/if}
				{triggerItem.title}
			</button>
		{/each}
	</div>
</div>
