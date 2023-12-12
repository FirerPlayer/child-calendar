<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { appConfig, isMobileDevie, pocketbase, preferedColor, titleStore } from '$lib/stores';
	import { createDialog, createDropdownMenu, createSlider, melt } from '@melt-ui/svelte';
	import { createForm } from 'felte';
	import {
		CalendarDate,
		Calendar2,
		Person,
		PersonFill,
		X,
		ThreeDotsVertical,
		BoxArrowRight
	} from 'svelte-bootstrap-icons';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import type { InferType } from 'yup';
	import { updateUser } from '$lib/validators/usuario';
	import { validator } from '@felte/validator-yup';
	import { DateFormatter } from '@internationalized/date';
	import { ripple } from 'svelte-ripple-action';
	import { ContrastRatioChecker } from 'contrast-ratio-checker';
	import { logOut, showNativeDatePicker } from '$lib/utils';
	import { addToast } from '$lib/components/Toast.svelte';

	titleStore.set('Perfil');

	const {
		elements: { portalled, overlay, content, title, close },
		states: { open }
	} = createDialog({
		closeOnOutsideClick: false
	});

	const {
		elements: { menu, item, trigger, arrow },
		states: { open: menuOpen }
	} = createDropdownMenu({
		arrowSize: 16
	});

	const { form, errors, data } = createForm<InferType<typeof updateUser>>({
		extend: validator({ schema: updateUser }),
		async onSubmit(data) {
			const id = $pocketbase.authStore.model?.id;
			await $pocketbase
				.collection('users')
				.update(id, data)
				.then((res) => {
					addToast({
						title: 'Sucesso',
						message: 'Alteraçoes salva!',
						type: 'success'
					});
				})
				.catch((err) => {
					addToast({
						title: 'Erro',
						message: 'Ocorreu um erro inesperado',
						type: 'error'
					});
					console.error(err);
				});
		}
	});
	data.subscribe((v) => {
		console.log(v.dataNascimento);
		return v;
	});
	let profileImgData: { src: string; alt: string; title?: string } = {
		src: '',
		alt: 'profile',
		title: 'Sem foto de perfil'
	};
	data.subscribe((v) => {
		if (!v.avatar) {
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			profileImgData.src = reader.result as string;
		};
		profileImgData.alt = v.avatar.name;
		profileImgData.title = v.avatar.name;
		reader.readAsDataURL(v.avatar);
	});

	const dateFormatter = new DateFormatter('pt-BR', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric'
	});
	let dn: string;

	const handleBeforeunload = (ev: BeforeUnloadEvent) => {
		ev.preventDefault();
		ev.returnValue = true;
	};
</script>

<svelte:window on:beforeunload={handleBeforeunload} />

<TopBar>
	<button use:melt={$trigger} class="p-2 pl-1 rounded-full">
		<ThreeDotsVertical class="w-8 h-8" />
	</button>
	{#if $menuOpen}
		<div
			transition:scale
			use:melt={$menu}
			class="bg-white z-9999 rounded-lg p-3 border-(2 black) shadow-lg"
			style="transform-origin: top right;"
		>
			<button
				use:melt={$item}
				on:click={() => {
					logOut();
				}}
				class="flex gap-3 items-center font-semibold
			focus:ring-2 focus:ring-primary-500"
			>
				<BoxArrowRight class="w-8 h-8" />
				Sair da conta
			</button>
			<div use:melt={$arrow} class="border-(t-2 l-2 black)" />
		</div>
	{/if}
</TopBar>
<!-- {#each shades as s}
	<div class="w-full h-5" style="background-color: {s};"></div>
{/each} -->
<form
	use:form
	class="p-6 flex-(~ col) gap-3 rounded-md w-full h-[calc(100lvh-3.5rem)] overflow-y-auto overflow-visible"
>
	{#await $pocketbase.collection('users').getOne($pocketbase.authStore.model?.id)}
		<div>Loading...</div>
	{:then user}
		{@const avatarSrc = $pocketbase.files.getUrl(user, user.avatar)}

		<!-- Avatar -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class="flex-(~ col) gap-2 items-center">
			{#if avatarSrc}
				<img
					src={avatarSrc}
					alt={user.username}
					class="w-full rounded-md max-w-50% max-h-36 md:w-36 object-cover"
				/>
			{:else}
				<div class="flex flex-col gap-2 items-center w-full">
					<div
						class="w-full max-w-50% max-h-36 md:w-36 h-28 rounded-md flex items-center justify-center"
					>
						<label
							use:ripple
							class="border-(~ dark-500) cursor-pointer ring-2 w-full h-full flex items-center justify-center"
							class:border-red-5={$errors.avatar}
						>
							{#if profileImgData.src != '' && !$errors.avatar}
								<img {...profileImgData} />
							{:else}
								<PersonFill class="w-20 h-20" />
							{/if}
							<input
								type="file"
								accept="image/*"
								name="avatar"
								id="avatar"
								class="appearance-none"
								style="display: none;"
							/>
						</label>
					</div>

					<span class="text-txt-500 font-bold cursor-default">Foto de perfil</span>

					{#if $errors.avatar}
						<p transition:slide class="text-red-5 font-semibold">{$errors.avatar[0]}</p>
					{/if}
				</div>
			{/if}
			<h2 class="text-base font-medium">Foto de perfil</h2>
		</div>
		<!-- Nome -->
		<div>
			<label for="nome" class="block text-lg font-bold">Nome</label>
			{#if user.nome}
				<input
					type="text"
					value={user.nome}
					name="nome"
					id="nome"
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{:else}
				<input
					type="text"
					placeholder="Informe seu nome"
					name="nome"
					id="nome"
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{/if}
			{#if $errors.nome}
				<p transition:slide class="text-red-5 font-semibold">{$errors.nome[0]}</p>
			{/if}
		</div>

		<!-- Data de Nascimento -->
		<div>
			<label for="dataNascimento" class="block text-lg font-bold">Data de Nascimento</label>
			{#if user.dataNascimento}
				{@const dataNasc = new Date(user.dataNascimento)}
				<div class="w-full flex gap-3 items-center">
					<input
						type="date"
						value={dateFormatter.format(dataNasc)}
						on:change={(e) => {
							//@ts-ignore
							dn = dateFormatter.format(e.target?.value);
						}}
						name="dataNascimento"
						id="dataNascimento"
						class:disable-picker={isMobileDevie}
						class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
					/>
					{#if isMobileDevie}
						<button
							use:ripple
							on:click={async () => {
								await showNativeDatePicker((date) => {
									dn = date;
								});
							}}
							class="w-25% py-4"
						>
							<CalendarDate class="w-8 h-8 mx-auto" />
						</button>
					{/if}
				</div>
			{:else}
				<div class="w-full flex gap-3 items-center">
					<input
						type="date"
						placeholder="Data de Nascimento"
						bind:value={dn}
						name="dataNascimento"
						id="dataNascimento"
						class:disable-picker={isMobileDevie}
						class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
					/>
					{#if isMobileDevie}
						<button
							use:ripple
							on:click={async () => {
								await showNativeDatePicker((date) => {
									dn = date;
								});
							}}
							class="w-25% py-4"
						>
							<CalendarDate class="w-8 h-8 mx-auto" />
						</button>
					{/if}
				</div>
			{/if}
			{#if $errors.dataNascimento}
				<p transition:slide class="text-red-5 font-semibold">{$errors.dataNascimento[0]}</p>
			{/if}
		</div>
		<!-- Profissão -->
		<div>
			<label for="profissao" class="block text-lg font-bold">Profissão</label>
			{#if user.profissao}
				<input
					type="text"
					value=""
					name="profissao"
					id="profissao"
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{:else}
				<input
					type="text"
					placeholder="Informe sua profissao"
					name="profissao"
					id="profissao"
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{/if}
			{#if $errors.profissao}
				<p transition:slide class="text-red-5 font-semibold">{$errors.profissao[0]}</p>
			{/if}
			<!-- svelte-ignore a11y-label-has-associated-control -->
		</div>
	{/await}
	<!-- <h1 class="text-cente font-bold text-2xl bg-white ring-2 ring-gray-700">Configurações do aplicativo</h1> -->

	<button
		use:ripple
		type="submit"
		title="Salvar alterações"
		class="w-full bg-primary-400 p-5 font-semibold text-xl rounded-lg
		focus:ring-2 focus:ring-primary-500 mt-auto"
	>
		Salvar
	</button>
</form>

<style>
	.disable-picker::-webkit-calendar-picker-indicator {
		display: none;
	}
</style>
