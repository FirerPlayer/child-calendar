<script lang="ts">
	import { pocketbase } from '$lib/stores';
	import { criarImagem, criarSom } from '$lib/validators/midias';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import { CardText, CloudUpload, Image, MusicNote } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { slide } from 'svelte/transition';
	import type { InferType } from 'yup';
	import { Howl } from 'howler';
	import MusicPlayer from './MusicPlayer.svelte';
	import { addToast } from './Toast.svelte';

	export let midiaType: 'imagens' | 'sons' | string = 'imagens';
	export let afterSubmit: (data?: { nome: string; data: File }) => void = () => {};

	const {
		form: imagemForm,
		errors: errorsImagem,
		data: dataImagem
	} = createForm<InferType<typeof criarImagem>>({
		extend: validator({ schema: criarImagem }),
		async onSubmit(data) {
			await $pocketbase
				.collection('imagens')
				.create({ ...data, userId: $pocketbase.authStore.model?.id })
				.then(() => {
					addToast({
						title: 'Sucesso',
						message: 'Midia criada com sucesso',
						type: 'success'
					});
					afterSubmit(data);
				})
				.catch((err) => {
					if (err.status !== 200) {
						if (err.data) {
							addToast({
								title: 'Erro',
								message: err.data.message,
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

	const {
		form: audioForm,
		errors: errorsAudio,
		data: dataAudio
	} = createForm<InferType<typeof criarSom>>({
		extend: validator({ schema: criarSom }),
		async onSubmit(data) {
			await $pocketbase
				.collection('sons')
				.create({ ...data, userId: $pocketbase.authStore.model?.id })
				.then(() => {
					addToast({
						title: 'Sucesso',
						message: 'Midia criada com sucesso',
						type: 'success'
					});
					afterSubmit(data);
				})
				.catch((err) => {
					if (err.status !== 200) {
						if (err.data) {
							addToast({
								title: 'Erro',
								message: err.data.message,
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

	let imageAttributes: { src: string; alt: string; title?: string } = {
		src: '',
		alt: 'profile',
		title: 'Sem foto de perfil'
	};

	dataImagem.subscribe((v) => {
		if (!v.data) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			imageAttributes.src = reader.result as string;
		};
		imageAttributes.alt = v.data.name;
		imageAttributes.title = v.data.name;
		reader.readAsDataURL(v.data);
	});

	let audioAttributes: { audio: Howl; title: string } = {
		audio: new Howl({ src: '' }),
		title: 'Sem audio'
	};

	dataAudio.subscribe((v) => {
		if (!v.data) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			audioAttributes.audio = new Howl({
				src: reader.result as string
				// format: v.data.name.split('.')[1]
			});
		};
		audioAttributes.title = v.data.name;
		reader.readAsDataURL(v.data);
	});
</script>

{#if midiaType === 'imagens'}
	<form use:imagemForm class="flex flex-col justify-center w-full h-full gap-3 p-2">
		<div class="flex flex-col gap-2">
			<label for="nome" class="text-txt-500 font-bold flex items-center gap-3">
				<CardText class="w-6 h-6" />
				Nome
			</label>
			<input
				type="text"
				name="nome"
				id="nome"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Nome da imagem"
				class:invalid={$errorsImagem.nome}
			/>
			{#if $errorsImagem.nome}
				<p transition:slide class="text-red-5 font-semibold">{$errorsImagem.nome[0]}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<span class="text-txt-500 font-bold cursor-default flex items-center gap-3">
				<Image class="w-6 h-6" />
				Imagem
			</span>
			<!-- svelte-ignore a11y-missing-attribute -->
			<label
				use:ripple
				class="w-full h-32 rounded-lg flex-(~ col) items-center justify-center
				border-(~ dark-500) cursor-pointer"
				class:border-red-5={$errorsImagem.data}
			>
				{#if $dataImagem.data}
					<img {...imageAttributes} />
				{:else}
					<CloudUpload class="w-16 h-16" />
					<h4 class="text-lg font-semibold">Selecione a imagem</h4>
				{/if}

				<input
					type="file"
					accept="image/*"
					name="data"
					id="data"
					class="appearance-none"
					style="display: none;"
				/>
			</label>
			{#if $dataImagem.data}
				<h4 class="text-sm font-semibold text-center">{imageAttributes.title}</h4>
				<h4 class="text-xs font-semibold text-center">
					{Math.round($dataImagem.data.size / 1024)} KB
				</h4>
			{/if}

			{#if $errorsImagem.data}
				<p transition:slide class="text-red-5 font-semibold">{$errorsImagem.data[0]}</p>
			{/if}
		</div>
		<button
			use:ripple
			type="submit"
			class="bg-secondary-500 rounded-lg flex items-center justify-center gap-5 !p-5
		text-2xl !focus:ring-primary-800 mt-auto justify-self-end"
		>
			Salvar imagem
		</button>
	</form>
{:else}
	<form use:audioForm class="flex flex-col justify-center w-full h-full gap-3 p-2">
		<div class="flex flex-col gap-2">
			<label for="nome" class="text-txt-500 font-bold flex items-center gap-3">
				<CardText class="w-6 h-6" />
				Nome
			</label>
			<input
				type="text"
				name="nome"
				id="nome"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Nome da imagem"
				class:invalid={$errorsAudio.nome}
			/>
			{#if $errorsAudio.nome}
				<p transition:slide class="text-red-5 font-semibold">{$errorsAudio.nome[0]}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<span class="text-txt-500 font-bold cursor-default flex items-center gap-3">
				<MusicNote class="w-6 h-6" />
				Áudio
			</span>
			<!-- svelte-ignore a11y-missing-attribute -->
			<label
				class="w-full h-32 rounded-lg flex-(~ col) items-center justify-center
				border-(~ dark-500) cursor-pointer"
				class:border-red-5={$errorsAudio.data}
			>
				{#if $dataAudio.data}
					<MusicPlayer mainDivClass="z-99999" {...audioAttributes} />
					<h4 class="text-xs font-semibold text-center">
						{Math.round($dataAudio.data.size / 1024)} KB
					</h4>
				{:else}
					<CloudUpload class="w-16 h-16" />
					<h4 class="text-lg font-semibold">Selecione um áudio</h4>
				{/if}

				<input
					type="file"
					accept="audio/*"
					name="data"
					id="data"
					class="appearance-none"
					style="display: none;"
				/>
			</label>
			{#if $errorsAudio.data}
				<p transition:slide class="text-red-5 font-semibold">{$errorsAudio.data[0]}</p>
			{/if}
		</div>
		<button
			use:ripple
			type="submit"
			class="bg-secondary-500 rounded-lg flex items-center justify-center gap-5 !p-5
		text-2xl !focus:ring-primary-800 mt-auto justify-self-end"
		>
			Salvar áudio
		</button>
	</form>
{/if}

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
</style>
