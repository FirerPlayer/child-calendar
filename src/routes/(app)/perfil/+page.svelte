<script context="module" lang="ts">
	export type User = {
		nome?: string;
		avatar?: string;
		email: string;
		dataNascimento?: Date;
		profissao?: string;
	};
</script>

<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { pocketbase, titleStore } from '$lib/stores';
	import { generateShades, hexToRgb, rgbToCss } from '$lib/utils';
	import { createDialog, createSlider, melt } from '@melt-ui/svelte';
	import { onMount } from 'svelte';
	import { Person, PlayBtn, X } from 'svelte-bootstrap-icons';
	import { fade, fly } from 'svelte/transition';

	titleStore.set('Perfil');
	const {
		elements: { portalled, overlay, content, title, close },
		states: { open }
	} = createDialog({
		closeOnOutsideClick: false
	});

	let shades = generateShades('#3fd7fd');

	const {
		elements: { root: rootR, range: rangeR, thumb: thumbR },
		states: { value: R }
	} = createSlider({
		defaultValue: [0],
		min: 0,
		max: 255
	});
	const {
		elements: { root: rootG, range: rangeG, thumb: thumbG },
		states: { value: G }
	} = createSlider({
		defaultValue: [0],
		min: 0,
		max: 255
	});
	const {
		elements: { root: rootB, range: rangeB, thumb: thumbB },
		states: { value: B }
	} = createSlider({
		defaultValue: [0],
		min: 0,
		max: 255
	});

	// let a = [
	// 	'#d9f7ff',
	// 	'#b2effe',
	// 	'#8ce7fe',
	// 	'#65dffd',
	// 	'#3fd7fd',
	// 	'#32acca',
	// 	'#268198',
	// 	'#195665',
	// 	'#0d2b33'
	// ];
</script>

<TopBar />
{#each shades as s}
	<div class="w-full h-5" style="background-color: {s};"></div>
{/each}
<div class="p-8 flex-(~ col) gap-3 rounded-md w-full h-[calc(100vh-3.5rem)]">
	{#await $pocketbase.collection('users').getOne($pocketbase.authStore.model?.id)}
		<div>Loading...</div>
	{:then user}
		{@const avatarSrc = $pocketbase.files.getUrl(user, user.avatar)}

		<!-- Avatar -->
		<div class="flex-(~ col) gap-2 items-center">
			{#if avatarSrc && user.nome}
				<img
					src={avatarSrc}
					alt={user.nome}
					class="w-full rounded-md max-w-50% max-h-36 md:w-36 object-cover"
				/>
			{:else}
				<div
					class="w-28 h-28 rounded-full flex items-center justify-center
          border-(~ dark-500)"
				>
					<Person class="w-20 h-20" />
				</div>
			{/if}
			{#if user.nome}
				<h2 class="block text-xl font-bold">{user.nome}</h2>
			{:else}
				<h2 class="block text-base">Sem dados</h2>
			{/if}
		</div>

		<!-- Data de Nascimento -->
		<div>
			<h2 class="block text-lg font-bold">Data de Nascimento</h2>
			{#if user.dataNascimento}
				{@const dataNasc = new Date(user.dataNascimento)}
				<h2 class="block text-base bg-secondary-500 p-2 rounded-lg">
					{`${dataNasc.getDate()}`.length === 1
						? `0${dataNasc.getDate()}`
						: dataNasc.getDate()}/{`${dataNasc.getMonth()}`.length === 1
						? `0${dataNasc.getMonth()}`
						: dataNasc.getMonth()}/{dataNasc.getFullYear()}
				</h2>
			{:else}
				<h2 class="block text-base">Sem dados</h2>
			{/if}
		</div>

		<!-- Profissão -->
		<div>
			<h2 class="block text-lg font-bold">Profissão</h2>
			{#if user.profissao}
				<h2 class="block text-base bg-secondary-500 p-2 rounded-lg">{user.profissao}</h2>
			{:else}
				<h2 class="block text-base bg-secondary-500 p-2 rounded-lg">Sem dados</h2>
			{/if}
		</div>
	{/await}
</div>

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
			use:melt={$content}
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
				<h1 class="text-3xl font-semibold text-center">Rotina</h1>

				<button
					use:melt={$close}
					class="p-2 appearance-none items-center justify-center rounded-full text-primary-800
						hover:bg-primary-200 focus:shadow-primary-400 focus:outline-none focus:ring-2
						focus:ring-primary-400"
				>
					<X class="w-8 h-8 " />
				</button>
			</div>
		</div>
	{/if}
</div>
