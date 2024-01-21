<script lang="ts">
	import { ripple } from 'svelte-ripple-action';
	import {
		Calendar2,
		Calendar2Check,
		Calendar2CheckFill,
		PersonFill,
		RocketTakeoff
	} from 'svelte-bootstrap-icons';
	import { createForm } from 'felte';
	import type { InferType } from 'yup';
	import { criarRotinaForm } from '$lib/validators/rotinas';
	import { validator } from '@felte/validator-yup';
	import { slide } from 'svelte/transition';
	import ImageLazy from './ImageLazy.svelte';
	import LoaderSvg from './LoaderSVG.svelte';
	import { draggingState, localTimeZone, pocketbase } from '$lib/stores';
	import ComboBoxSons, { defaultSound, type Som } from './ComboBoxSons.svelte';
	import { writable } from 'svelte/store';
	import { addToast } from './Toast.svelte';
	import { CalendarDate, fromDate, toCalendarDateTime } from '@internationalized/date';
	import { onMount } from 'svelte';
	import { getFormattedDate, getTodayString, showNativeDatePicker } from '$lib/utils';

	export let initialValues: InferType<typeof criarRotinaForm> = { nome: '' };
	export let imgData: { src: string; alt: string; title: string } = {
		src: '',
		alt: '',
		title: ''
	};
	export let afterSubmit: (data?: InferType<typeof criarRotinaForm>) => void = () => {};
	let audioSelecionado = writable<Som>(defaultSound);
	let loading = false;

	const { form, errors, data } = createForm<InferType<typeof criarRotinaForm>>({
		extend: validator({ schema: criarRotinaForm }),
		initialValues,
		onSubmit: async (data) => {
			data.estado = 'pendente';
			loading = true;
			// console.log(data);
			if (data.dataInicio) {
				data.dataInicio = fromDate(new Date(data.dataInicio), localTimeZone).toAbsoluteString();
			}
			if (data.dataFim) {
				data.dataFim = fromDate(new Date(data.dataFim), localTimeZone).toAbsoluteString();
			}
			await $pocketbase
				.collection('rotinas')
				.create({
					...data,
					userId: $pocketbase.authStore.model?.id,
					imagem: $draggingState.data?.id
				})
				.then(() => {
					addToast({
						title: 'Sucesso',
						message: 'Rotina criada com sucesso',
						type: 'success'
					});
					afterSubmit(data);
					loading = false;
				})
				.catch((err) => {
					loading = false;
					if (err.status !== 200) {
						if (err.data) {
							addToast({
								title: 'Erro',
								message: 'Falha ao criar rotina',
								type: 'error'
							});
						} else {
							addToast({
								title: 'Erro',
								message: 'Ocorreu um erro inesperado',
								type: 'error'
							});
						}
					}
				});
		}
	});

	audioSelecionado.subscribe((v) => {
		data.update((dt) => {
			dt.somEstimulo = v.id;
			return dt;
		});
	});

	const handleDataInicioInput = (e: Event) => {
		$data.dataInicio = (e.target as HTMLInputElement).value;
	};
	const handleDataFimInput = (e: Event) => {
		$data.dataFim = (e.target as HTMLInputElement).value;
	};
	onMount(() => {
		console.log('ini: ', initialValues);
	});
	let inp1: HTMLInputElement;
	let inp2: HTMLInputElement;
</script>

<form use:form class="flex flex-col justify-center w-full gap-2 py-2">
	<!-- IMAGEM -->
	<div class="flex flex-col items-center justify-center gap-2">
		<label for="imagem" class="text-txt-500 font-bold">Imagem</label>
		<ImageLazy
			{...imgData}
			classNameDiv="w-28 h-28 rounded-lg flex items-center justify-center"
			classNameImg="w-inherit h-inherit rounded-inherit object-cover"
		>
			<LoaderSvg class="w-8 h-8" />
		</ImageLazy>
	</div>

	<!-- NOME -->
	<div class="flex flex-col gap-2">
		<label for="nome" class="text-txt-500 font-bold">Nome</label>
		<input
			type="text"
			id="nome"
			name="nome"
			class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
			placeholder="Digite seu nome"
			class:invalid={$errors.nome}
		/>
		{#if $errors.nome}
			<p transition:slide class="text-red-5 font-semibold">{$errors.nome[0]}</p>
		{/if}
	</div>

	<!-- descricao -->
	<div class="flex flex-col gap-2">
		<label for="descricao" class="text-txt-500 font-bold">Descrição</label>
		<textarea
			id="descricao"
			name="descricao"
			class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
			style="resize: none;"
			placeholder="Digite uma descricao"
			class:invalid={$errors.descricao}
		/>
		{#if $errors.descricao}
			<p transition:slide class="text-red-5 font-semibold">{$errors.descricao[0]}</p>
		{/if}
	</div>

	<!-- Datas e horas de inicio e fim -->
	<div class="flex flex-col gap-2 w-full">
		<label class=" p-2 bg-primary-200 rounded-lg">
			<h2 class="font-bold text-lg">Inicia em</h2>
			<button
				type="button"
				on:click={(e) => {
					inp1.showPicker();
				}}
				class="flex items-center gap-3"
			>
				<Calendar2 class="w-8 h-8" />
				<!-- <span>{$data.dataInicio}</span> -->
				<span>{$data.dataInicio ? getFormattedDate(new Date($data.dataInicio)) : 'Sem data'}</span>
				<!-- {$data.dataInicio ? $data.dataInicio.replace('T', ' às ') : 'Sem data'} -->
			</button>
			<input
				bind:this={inp1}
				type="datetime-local"
				name="dataInicio"
				id="dataInicio"
				class:invalid={$errors.dataInicio}
				class="bg-red absolute w-0 h-0"
				on:input={handleDataInicioInput}
			/>
		</label>
		{#if $errors.dataInicio}
			<p transition:slide class="text-red-5 font-semibold">{$errors.dataInicio[0]}</p>
		{/if}
	</div>
	<div class="flex flex-col gap-2 w-full">
		<label class=" p-2 bg-primary-200 rounded-lg">
			<h2 class="font-bold text-lg">Termina em</h2>
			<button
				type="button"
				on:click={(e) => {
					inp2.showPicker();
				}}
				class="flex items-center gap-3"
			>
				<Calendar2 class="w-8 h-8" />
				<span>{$data.dataFim ? getFormattedDate(new Date($data.dataFim)) : 'Sem data'}</span>
				<!-- {$data.dataInicio ? $data.dataInicio.replace('T', ' às ') : 'Sem data'} -->
			</button>
			<input
				bind:this={inp2}
				min={$data.dataInicio}
				type="datetime-local"
				name="dataFim"
				id="dataFim"
				class:invalid={$errors.dataFim}
				class="bg-red absolute w-0 h-0"
				on:input={handleDataFimInput}
			/>
		</label>
		{#if $errors.dataFim}
			<p transition:slide class="text-red-5 font-semibold">{$errors.dataFim[0]}</p>
		{/if}
	</div>
	<!-- <div class="flex flex-col gap-2 w-full">
		<label for="dataFim" class="font-bold text-lg px-2 py-1 bg-primary-200 rounded-lg">
			Termina em
		</label>
		<input
			type="datetime-local"
			placeholder="Data de termino"
			name="dataFim"
			id="dataFim"
			class:disable-picker={true}
			class:invalid={$errors.dataFim}
			class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
		/>
		{#if $errors.dataFim}
			<p transition:slide class="text-red-5 font-semibold">{$errors.dataFim[0]}</p>
		{/if}
	</div> -->

	<!-- SomEstimulo -->
	<ComboBoxSons bind:selected={$audioSelecionado} />
	<input type="text" name="somEstimulo" id="somEstimulo" class="hidden" />

	<button
		use:ripple
		type="submit"
		class="flex items-center justify-center gap-3 p-4 mt-2 text-2xl
    focus:ring-2 !focus:ring-primary-800 bg-primary-400 rounded-full"
	>
		{#if loading}
			<LoaderSvg class="w-8 h-8" />
		{:else}
			<Calendar2Check class="w-8 h-8" />
		{/if}
		Agendar
	</button>
</form>

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
	.disable-picker::-webkit-calendar-picker-indicator {
		display: none;
	}
</style>
