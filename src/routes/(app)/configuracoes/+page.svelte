<script lang="ts">
	import ComboBoxSons from '$lib/components/ComboBoxSons.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import {
		appConfig,
		// preferedColor,
		saveConfig,
		titleStore,
		type AppConfig,
		defaultConfig
	} from '$lib/stores';
	import { updateElementPrimaryColor } from '$lib/utils';
	import { createSlider, melt } from '@melt-ui/svelte';
	import { ContrastRatioChecker } from 'contrast-ratio-checker';
	import { onMount } from 'svelte';
	import { ArrowCounterclockwise, Floppy2 } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';

	titleStore.set('Configurações');
	let saved = false;
	let configChanged: boolean;
	let mainDiv: HTMLElement;

	let tempConfig = { ...$appConfig };

	const {
		elements: { root: rootR, thumb: thumbR },
		states: { value: R }
	} = createSlider({
		defaultValue: [$appConfig.preferedColor[0]],
		min: 0,
		max: 255
	});
	const {
		elements: { root: rootG, thumb: thumbG },
		states: { value: G }
	} = createSlider({
		defaultValue: [$appConfig.preferedColor[1]],
		min: 0,
		max: 255
	});
	const {
		elements: { root: rootB, thumb: thumbB },
		states: { value: B }
	} = createSlider({
		defaultValue: [$appConfig.preferedColor[2]],
		min: 0,
		max: 255
	});

	const contrastChecker = new ContrastRatioChecker();

	$: currColor = [$R[0], $G[0], $B[0]];
	$: {
		// preferedColor.set(currColor);
		tempConfig.preferedColor = currColor;
		if (mainDiv) {
			updateElementPrimaryColor(mainDiv, currColor);
		}
	}
	$: currContrastRatio = contrastChecker.getContrastRatioByRgb(
		{ red: 0, green: 4, blue: 5 },
		{ red: $R[0], green: $G[0], blue: $B[0] }
	);

	// const handleBeforeUnload = (e: BeforeUnloadEvent) => {
	// 	// e.preventDefault();
	// 	// console.log(JSON.stringify(tempConfig));
	// 	// console.log(JSON.stringify(tempConfig) !== JSON.stringify($appConfig));
	// 	// e.preventDefault();
	// 	if (JSON.stringify(tempConfig) !== JSON.stringify($appConfig)) {
	// 		console.log('não salvou');
	// 		preferedColor.set($appConfig.preferedColor);
	// 		updateElementPrimaryColor($appConfig.preferedColor);
	// 	}
	// };
	// console.log($appConfig.preferedColor);

	const handleSalvar = (ev: MouseEvent) => {
		saveConfig(tempConfig);
		addToast({
			title: 'Sucesso',
			message: 'Configurações salvas',
			type: 'success'
		});
	};
	const handleResetar = (ev: MouseEvent) => {
		tempConfig = { ...defaultConfig };
		currColor = defaultConfig.preferedColor;
		$R[0] = defaultConfig.preferedColor[0];
		$G[0] = defaultConfig.preferedColor[1];
		$B[0] = defaultConfig.preferedColor[2];
		addToast({
			title: 'Sucesso',
			message: 'Configurações resetadas',
			type: 'success'
		});
	};
</script>

<!-- <svelte:window on:beforeunload={handleBeforeUnload} /> -->
<div bind:this={mainDiv}>
	<TopBar />
	<div class="flex-(~ col) gap-3 h-[calc(100svh-3.5rem)] p-8">
		<h1 class="block text-lg font-bold">Cor preferida</h1>
		<div class="flex-(~ col) gap-4 bg-primary-500 p-3 rounded-lg">
			<div class="flex gap-2 w-full">
				<input
					type="text"
					bind:value={$R[0]}
					class="w-1/6 h-8 text-center focus:outline-none border-2 border-gray-700"
				/>
				<span
					use:melt={$rootR}
					class="relative flex h-8 w-full items-center pointer-events-initial
					[&>span]:pointer-events-initial border-(2 gray-700) bg-gradient-to-r from-white to-red-500"
				>
					<span
						use:melt={$thumbR()}
						class="block h-8 w-4 bg-primary-500 ring-4 ring-gray-700 focus:!outline-none"
					></span>
				</span>
			</div>
			<div class="flex gap-2 w-full">
				<input
					type="text"
					bind:value={$G[0]}
					class="w-1/6 h-8 text-center focus:outline-none border-2 border-gray-700"
				/>
				<span
					use:melt={$rootG}
					class="relative flex h-8 w-full items-center pointer-events-initial
					[&>span]:pointer-events-initial border-(2 gray-700) bg-gradient-to-r from-white to-green-500"
				>
					<span
						use:melt={$thumbG()}
						class="block h-8 w-4 bg-primary-500 ring-4 ring-gray-700 focus:!outline-none"
					></span>
				</span>
			</div>
			<div class="flex gap-2 w-full">
				<input
					type="text"
					bind:value={$B[0]}
					class="w-1/6 h-8 text-center focus:outline-none border-2 border-gray-700"
				/>
				<span
					use:melt={$rootB}
					class="relative flex h-8 w-full items-center pointer-events-initial
					[&>span]:pointer-events-initial border-(2 gray-700) bg-gradient-to-r from-white to-blue-500"
				>
					<span
						use:melt={$thumbB()}
						class="block h-8 w-4 bg-primary-500 ring-4 ring-gray-700 focus:!outline-none"
					></span>
				</span>
			</div>
		</div>
		{#if currContrastRatio < 2.5}
			<h3
				in:scale
				class="text-base text-txt-500 bg-red-5/40 font-semibold p-2 text-center rounded-lg"
			>
				Cuidado com a combinação de cores. <br /> O texto pode ficar ilegivel.
			</h3>
		{/if}
		<!-- <div>
			<h1 class="block text-lg font-bold">Som para mover as rotinas</h1>
		</div> -->
		<ComboBoxSons bind:selected={tempConfig.dragAndDropSound} title="Som para mover as rotinas" />
		<div class="flex-(~ col) gap-2 mt-auto">
			<button
				use:ripple
				on:click={handleResetar}
				title="Salvar alterações"
				class="flex items-center gap-3 justify-center gap-3w-full bg-primary-400 p-5 font-semibold text-xl rounded-lg
				focus:ring-2 focus:ring-primary-500"
			>
				<ArrowCounterclockwise class="w-8 h-8" />
				Resetar
			</button>
			<button
				use:ripple
				on:click={handleSalvar}
				title="Salvar alterações"
				class="flex items-center justify-center gap-3 w-full bg-primary-400 p-5 font-semibold text-xl rounded-lg
				focus:ring-2 focus:ring-primary-500"
			>
				<Floppy2 class="w-8 h-8" />
				Salvar
			</button>
		</div>
	</div>
</div>
