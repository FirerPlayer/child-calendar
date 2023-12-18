<script lang="ts">
	import { pocketbase } from '$lib/stores';
	import { getAtualizarMidia } from '$lib/validators/midias';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import type { RecordModel } from 'pocketbase';
	import type { InferType } from 'yup';
	import { addToast } from './Toast.svelte';
	import {
		CloudUpload,
		Floppy2,
		Image,
		MusicNote,
		PencilSquare,
		PersonFill,
		Trash
	} from 'svelte-bootstrap-icons';
	import MusicPlayer from './MusicPlayer.svelte';
	import ImageLazy from './ImageLazy.svelte';
	import { slide } from 'svelte/transition';
	import LoaderSvg from './LoaderSVG.svelte';
	import { ripple } from 'svelte-ripple-action';
	import { onMount } from 'svelte';

	export let midiaType: 'imagens' | 'sons' | string = 'imagens';
	export let midia: RecordModel;
	export let afterSubmit: (data?: InferType<typeof val>) => void = () => {};

	const val = getAtualizarMidia(midiaType as 'imagens' | 'sons');
	let loading = false;
	let loading2 = false;

	const { form, errors, data } = createForm<InferType<typeof val>>({
		extend: validator({ schema: val }),
		onSubmit: async (data) => {
			loading = true;
			await $pocketbase
				.collection(midia.collectionName)
				.update(midia.id, {
					...data
				})
				.then(() => {
					loading = false;
					addToast({
						title: 'Sucesso',
						message: 'Midia atualizada com sucesso',
						type: 'success'
					});
					afterSubmit(data);
				})
				.catch((err) => {
					loading = false;
					addToast({
						title: 'Erro',
						message: 'Falha ao atualizar midia',
						type: 'error'
					});
				});
		}
	});
	let profileImgData: { src: string; alt: string; title?: string } = {
		src: midia.data,
		alt: midia.nome,
		title: midia.nome
	};

	const handleDelete = async (e: MouseEvent) => {
		loading2 = true;
		await $pocketbase
			.collection(midia.collectionName)
			.delete(midia.id)
			.then(() => {
				loading2 = false;
				addToast({
					title: 'Sucesso',
					message: 'Midia excluída com sucesso',
					type: 'success'
				});
				afterSubmit($data);
			})
			.catch((err) => {
				loading2 = false;
				addToast({
					title: 'Erro',
					message: 'Falha ao excluir midia',
					type: 'error'
				});
			});
	};
	let audioAttributes: { audio?: Howl; title: string } = {
		title: midia.nome,
		audio: new Howl({
			src: midia.data
		})
	};

	data.subscribe((v) => {
		if (!v.data) {
			return;
		}
		if (midiaType === 'imagens') {
			const reader = new FileReader();
			reader.onload = () => {
				profileImgData.src = reader.result as string;
			};
			profileImgData.alt = v.nome;
			profileImgData.title = v.nome;
			reader.readAsDataURL(v.data);
		} else {
			const reader = new FileReader();
			reader.onload = () => {
				audioAttributes.audio = new Howl({
					src: reader.result as string
					// format: v.data.name.split('.')[1]
				});
			};
			audioAttributes.title = v.data.name;
			reader.readAsDataURL(v.data);
		}
	});

	$: audioIsCorrectSelected = audioAttributes.audio && !$errors.data;
</script>

<form use:form class="flex flex-col justify-center w-full h-full gap-3 p-2">
	<!-- Midia -->
	{#if midiaType === 'imagens'}
		<div class="flex-(~ col) gap-2 items-center">
			<div class="flex-(~ col) gap-2 items-center">
				<div
					class="w-40 h-32 rounded-lg flex items-center justify-center
               border-(~ gray-700) cursor-pointer"
				>
					<ImageLazy
						{...profileImgData}
						classNameDiv="rounded-inherit h-full flex w-full items-center justify-center"
						classNameImg="rounded-inherit h-full w-full object-cover"
					>
						<Image class="w-20 h-20" />
					</ImageLazy>
				</div>
				{#if $errors.data}
					<p transition:slide class="text-red-5 font-semibold">{$errors.data[0]}</p>
				{/if}
				<div class="flex gap-2 items-center">
					<h2 class="text-txt-500 font-bold cursor-default">Imagem</h2>
					<label class="w-fit h-fit p-2 border-(~ gray-700) rounded-lg bg-primary-300 z-50">
						<PencilSquare class="w-6 h-6" />
						<input
							type="file"
							accept="image/*"
							name="data"
							id="data"
							class="appearance-none"
							style="display: none;"
						/>
					</label>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-2 w-full">
			<div class="text-txt-500 font-bold cursor-default flex items-center gap-3">
				<MusicNote class="w-6 h-6" />
				Áudio
				<label class="w-fit h-fit border-(~ gray-700) rounded-lg p-1 z-50 ml-auto">
					<PencilSquare class="w-6 h-6" />
					<input
						type="file"
						accept="audio/*"
						name="data"
						id="data"
						class="appearance-none"
						style="display: none;"
					/>
				</label>
			</div>
			{#if $errors.data}
				<p transition:slide class="text-red-5 font-semibold">{$errors.data[0]}</p>
			{/if}
			{#if audioAttributes.audio && audioIsCorrectSelected}
				{#key audioAttributes.audio}
					<MusicPlayer
						mainDivClass="z-99999"
						title={audioAttributes.title}
						audio={audioAttributes.audio}
					/>
				{/key}
			{/if}
		</div>
	{/if}

	<!-- NOME -->
	<div class="flex-(~ col) gap-2">
		<label for="nome" class="block text-lg font-bold">Nome</label>
		<input
			type="text"
			value={midia.nome}
			name="nome"
			id="nome"
			class:invalid={$errors.nome}
			class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
		/>

		{#if $errors.nome}
			<p transition:slide class="text-red-5 font-semibold">{$errors.nome[0]}</p>
		{/if}
	</div>

	<div class="flex-(~ col) gap-2 mt-auto">
		<button
			use:ripple
			on:click={handleDelete}
			type="button"
			class="bg-red-400 rounded-lg flex items-center justify-center gap-5 !p-5
      text-2xl focus:ring-2 !focus:ring-red-800 mt-auto justify-self-end"
		>
			{#if loading2}
				<LoaderSvg class="w-8 h-8" />
			{:else}
				<Trash class="w-8 h-8" />
			{/if}
			Excluir {midiaType == 'imagens' ? 'imagem' : 'audio'}
		</button>
		<button
			use:ripple
			type="submit"
			class="bg-primary-400 rounded-lg flex items-center justify-center gap-5 !p-5
      text-2xl !focus:ring-primary-800 mt-auto justify-self-end"
		>
			{#if loading}
				<LoaderSvg class="w-8 h-8" />
			{:else}
				<Floppy2 class="w-8 h-8" />
			{/if}
			Salvar {midiaType == 'imagens' ? 'imagem' : 'audio'}
		</button>
	</div>
</form>
