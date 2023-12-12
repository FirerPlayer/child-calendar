<script lang="ts">
	import { pocketbase } from '$lib/stores';
	import { createCombobox, melt, type ComboboxOptionProps } from '@melt-ui/svelte';
	import { onMount } from 'svelte';
	import { Check, ChevronDown, ChevronUp, MusicNoteBeamed } from 'svelte-bootstrap-icons';
	import { fly } from 'svelte/transition';
	import LoaderSvg from './LoaderSVG.svelte';
	import pickSound from '$lib/assets/pickSound.wav';

	type Som = {
		nome: string;
		userId: string;
		data: string;
		disabled: boolean;
	};
	let defaultSound: Som = {
		nome: 'Som padrão',
		data: pickSound,
		userId: '',
		disabled: true
	};

	let sons: Som[] = [];
	let loading = false;
	export let selected: string;

	export let title = '';

	const toOption = (som: Som): ComboboxOptionProps<Som> => ({
		value: som,
		label: som.nome,
		disabled: som.disabled
	});

	const {
		elements: { menu, input, option, label },
		states: { open, inputValue, touchedInput, selected: selectedOption },
		helpers: { isSelected }
	} = createCombobox<Som>({
		forceVisible: true,
		defaultSelected: toOption(defaultSound)
	});
	selectedOption.subscribe((option) => {
		if (option && option.value) {
			selected = option.value.data;
		}
	});

	$: if (!$open) {
		$inputValue = $selectedOption?.label ?? '';
	}

	const getSounds = async () => {
		loading = true;
		let somRes = await $pocketbase.collection('sons').getFullList<Som>({
			sort: '-created'
		});
		sons = [...somRes];
		sons.push(defaultSound);
		loading = false;
	};

	$: filteredMangas = $touchedInput
		? sons.filter(({ nome, data }) => {
				const normalizedInput = $inputValue.toLowerCase();
				return (
					nome.toLowerCase().includes(normalizedInput) ||
					data.toLowerCase().includes(normalizedInput)
				);
			})
		: sons;

	open.subscribe(async () => {
		await getSounds();
	});
</script>

<div class="flex flex-col gap-2">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
		<span class="block text-lg font-bold">{title}</span>
	</label>

	<div class="relative">
		<input
			use:melt={$input}
			class="flex h-12 w-full items-center justify-between rounded-lg bg-white
          p-5 text-black"
			placeholder="Selecione um som..."
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2">
			{#if $open}
				<ChevronUp class="w-4 h-4" />
			{:else}
				<ChevronDown class="w-4 h-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
			tabindex="0"
		>
			{#each filteredMangas as som, i (i)}
				<li
					use:melt={$option(toOption(som))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 px-4
        hover:bg-primary-100 data-[disabled]:opacity-50 overflow-hidden"
				>
					<div class:selected={$isSelected(som)} class="p-1">
						<div class="flex gap-2 items-center">
							<MusicNoteBeamed class="w-7 h-7" />
							<p class="font-medium overflow-hidden w-[200px]">{som.nome}</p>
						</div>
						<p
							class="text-sm opacity-75 text-ellipsis overflow-hidden whitespace-nowrap max-w-full"
						>
							{som.data}
						</p>
					</div>
				</li>
			{:else}
				{#if loading}
					<LoaderSvg class="w-8 h-8" />
				{:else}
					<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">Sem resultados</li>
				{/if}
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.selected {
		--uno: bg-primary-300 text-primary-900 font-semibold;
	}
</style>
