<script lang="ts">
	import { ripple } from 'svelte-ripple-action';
	import { PersonFill, RocketTakeoff } from 'svelte-bootstrap-icons';
	import { createForm } from 'felte';
	import type { InferType } from 'yup';
	import { criarRotina } from '$lib/validators/rotinas';
	import { validator } from '@felte/validator-yup';
	import { slide } from 'svelte/transition';

	const { form, errors, data } = createForm<InferType<typeof criarRotina>>({
		extend: validator({ schema: criarRotina })
	});
</script>

<form use:form class="flex flex-col justify-center w-full gap-2 py-2 px-8">
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
	<!-- dataInicio -->
	<div class="flex flex-col gap-2">
		<label for="dataInicio" class="text-txt-500 font-bold">Começa</label>
		<input
			type="date"
			placeholder="Data de Inicio"
			name="dataInicio"
			id="dataInicio"
			class:disable-picker={true}
			class:invalid={$errors.dataInicio}
			class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
		/>
		{#if $errors.dataInicio}
			<p transition:slide class="text-red-5 font-semibold">{$errors.dataInicio[0]}</p>
		{/if}
	</div>
	<!-- dataFim -->
	<div class="flex flex-col gap-2">
		<label for="dataFim" class="text-txt-500 font-bold">Termina</label>
		<input
			type="date"
			placeholder="Data de Termino"
			name="dataFim"
			id="dataFim"
			class:disable-picker={true}
			class:invalid={$errors.dataFim}
			class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
		/>
		{#if $errors.dataFim}
			<p transition:slide class="text-red-5 font-semibold">{$errors.dataFim[0]}</p>
		{/if}
	</div>

	<button
		use:ripple
		type="submit"
		class="flex items-center justify-center gap-3 p-4 mt-2 text-2xl
    focus:ring-2 !focus:ring-primary-800 bg-primary-500 rounded-full"
	>
		<RocketTakeoff class="w-8 h-8" />
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
