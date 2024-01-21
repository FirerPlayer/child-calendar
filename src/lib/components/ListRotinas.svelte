<script lang="ts">
	import { pocketbase } from '$lib/stores';
	import { ripple } from 'svelte-ripple-action';
	import type { DateValue } from '@internationalized/date';
	import type { RecordModel } from 'pocketbase';
	import { createEventDispatcher } from 'svelte';

	const onClickEventDispatch = createEventDispatcher<{
		rotinaClick: RecordModel;
	}>();

	export let currentDate: DateValue;
	export let rotinas: RecordModel[];
	let rotinasPendentes: RecordModel[] = rotinas.filter((r) => {
		return r.estado == 'pendente';
	});
	let rotinasConcluidas: RecordModel[] = rotinas.filter((r) => {
		return r.estado == 'concluido';
	});
	function getPeriodOfDay(date: Date): 'manha' | 'tarde' | 'noite' {
		const hour = date.getHours();

		if (hour >= 7 && hour < 12) {
			return 'manha';
		} else if (hour >= 12 && hour < 18) {
			return 'tarde';
		} else {
			return 'noite';
		}
	}
</script>

<div class="flex flex-col gap-4 flex-grow overflow-y-auto">
	<!-- Manhça -->
	<div
		class="bg-sky-4/50 p-3 pt-1 flex-(~ col) gap-2
	min-h-44 border-(2 dashed gray-700) overflow-hidden"
	>
		<h3 class="text-2xl opacity-75">Manhã - 07:00 às 12:00</h3>
		<div class="flex gap-2 flex-nowrap overflow-x-auto">
			{#each rotinasPendentes as r, i}
				{@const imagem = r.expand?.imagem}
				{@const rotinaImgSrc = $pocketbase.files.getUrl(imagem, imagem.data)}
				{@const dataInicio = new Date(r.dataInicio)}
				{@const periodo = getPeriodOfDay(dataInicio)}
				{#if periodo == 'manha'}
					<button
						on:click={(ev) => {
							onClickEventDispatch('rotinaClick', r);
						}}
						use:ripple
						class="flex flex-col items-center justify-center gap-2px p-1
					rounded-4 min-w-22 min-h-22 shadow-lg border-2 border-gray-700"
					>
						<img
							src={rotinaImgSrc}
							alt={r.imagem.nome}
							title={r.imagemNome}
							class="w-20 h-20 object-cover rounded-inherit"
						/>
						<h3 class="text-base font-semibold w-20 overflow-hidden text-ellipsis line-clamp-2">
							{r.nome}
						</h3>
					</button>
				{/if}
			{/each}
		</div>
	</div>
	<!-- Tarde -->
	<div
		class="bg-green-4/50 p-3 pt-1 flex-(~ col) gap-2
	min-h-44 border-(2 dashed gray-700) overflow-hidden"
	>
		<h3 class="text-2xl opacity-75">Tarde - 12:00 às 18:00</h3>
		<div class="flex gap-2 flex-nowrap overflow-x-auto">
			{#each rotinasPendentes as r, i}
				{@const imagem = r.expand?.imagem}
				{@const rotinaImgSrc = $pocketbase.files.getUrl(imagem, imagem.data)}
				{@const dataInicio = new Date(r.dataInicio)}
				{@const periodo = getPeriodOfDay(dataInicio)}
				{#if periodo == 'tarde'}
					<button
						on:click={(ev) => {
							onClickEventDispatch('rotinaClick', r);
						}}
						use:ripple
						class="flex flex-col items-center justify-center gap-2px p-1
					rounded-4 min-w-22 min-h-22 shadow-lg border-2 border-gray-700"
					>
						<img
							src={rotinaImgSrc}
							alt={r.imagem.nome}
							title={r.imagemNome}
							class="w-20 h-20 object-cover rounded-inherit"
						/>
						<h3 class="text-base font-semibold w-20 overflow-hidden text-ellipsis line-clamp-2">
							{r.nome}
						</h3>
					</button>
				{/if}
			{/each}
		</div>
	</div>
	<!-- Noite -->
	<div
		class="bg-sky-9/50 p-3 pt-1 flex-(~ col) gap-2
	min-h-44 border-(2 dashed gray-700) overflow-hidden"
	>
		<h3 class="text-2xl opacity-75">Noite - 18:00 às 07:00</h3>
		<div class="flex gap-2 flex-nowrap overflow-x-auto">
			{#each rotinasPendentes as r, i}
				{@const imagem = r.expand?.imagem}
				{@const rotinaImgSrc = $pocketbase.files.getUrl(imagem, imagem.data)}
				{@const dataInicio = new Date(r.dataInicio)}
				{@const periodo = getPeriodOfDay(dataInicio)}
				{#if periodo == 'noite'}
					<button
						on:click={(ev) => {
							onClickEventDispatch('rotinaClick', r);
						}}
						use:ripple
						class="flex flex-col items-center justify-center gap-2px p-1
					rounded-4 min-w-22 min-h-22 shadow-lg border-2 border-gray-700"
					>
						<img
							src={rotinaImgSrc}
							alt={r.imagem.nome}
							title={r.imagemNome}
							class="w-20 h-20 object-cover rounded-inherit"
						/>
						<h3 class="text-base font-semibold w-20 overflow-hidden text-ellipsis line-clamp-2">
							{r.nome}
						</h3>
					</button>
				{/if}
			{/each}
		</div>
	</div>
	<!-- Concluidas -->
	<div
		class=" p-3 pt-1 flex-(~ col) gap-2
	min-h-44 aborder-(2 dashed gray-700) overflow-hidden"
	>
		<h3 class="text-2xl opacity-75">Rotinas concluidas</h3>
		<div class="flex gap-2 flex-nowrap overflow-x-auto">
			{#each rotinasConcluidas as r, i}
				{@const imagem = r.expand?.imagem}
				{@const rotinaImgSrc = $pocketbase.files.getUrl(imagem, imagem.data)}
				<!-- {@const dataInicio = new Date(r.dataInicio)} -->
				<!-- {@const periodo = getPeriodOfDay(dataInicio)} -->
				<!-- {#if periodo == 'noite'} -->
				<button
					on:click={(ev) => {
						onClickEventDispatch('rotinaClick', r);
					}}
					use:ripple
					class="flex flex-col items-center justify-center gap-2px p-1
					rounded-4 min-w-22 min-h-22 shadow-lg border-2 border-gray-700"
				>
					<img
						src={rotinaImgSrc}
						alt={r.imagem.nome}
						title={r.imagemNome}
						class="w-20 h-20 object-cover rounded-inherit"
					/>
					<h3 class="text-base font-semibold w-20 overflow-hidden text-ellipsis line-clamp-2">
						{r.nome}
					</h3>
				</button>
				<!-- {/if} -->
			{/each}
		</div>
	</div>
</div>
