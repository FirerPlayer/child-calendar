<script lang="ts">
	import TopBar from '$lib/components/TopBar.svelte';
	import { isMobileDevie, pocketbase, titleStore, userStores } from '$lib/stores';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { createForm } from 'felte';
	import {
		PersonFill,
		ThreeDotsVertical,
		BoxArrowRight,
		PencilSquare,
		Envelope
	} from 'svelte-bootstrap-icons';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import type { InferType } from 'yup';
	import { updateUser } from '$lib/validators/usuario';
	import { validator } from '@felte/validator-yup';
	import { DateFormatter } from '@internationalized/date';
	import { ripple } from 'svelte-ripple-action';
	import { logOut, showNativeDatePicker } from '$lib/utils';
	import { addToast } from '$lib/components/Toast.svelte';
	import ImageLazy from '$lib/components/ImageLazy.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { RecordModel } from 'pocketbase';

	titleStore.set('Perfil');
	const {
		elements: { menu, item, trigger, arrow },
		states: { open: menuOpen }
	} = createDropdownMenu({
		arrowSize: 16
	});

	const { form, errors, data } = createForm<InferType<typeof updateUser>>({
		extend: validator({ schema: updateUser })
	});
	async function onSubmit(data: InferType<typeof updateUser>) {
		let canSubmit = true;
		Object.entries($errors).forEach(([key, value]) => {
			if (value) {
				canSubmit = false;
			}
		});
		if (!canSubmit) {
			return;
		}

		console.log($errors);
		console.log('submit');
		const id = $pocketbase.authStore.model?.id;
		await $pocketbase
			.collection('users')
			.update(id, data)
			.then((res) => {
				addToast({
					title: 'Sucesso',
					message: 'Alterações salvas!',
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
	const user = $userStores as RecordModel;
	const avatarSrc = $pocketbase.files.getUrl(user, user.avatar);
	console.log(avatarSrc);

	// const handleBeforeunload = (ev: BeforeUnloadEvent) => {
	// 	ev.preventDefault();
	// 	ev.returnValue = true;
	// };
</script>

<!-- <svelte:window on:beforeunload={handleBeforeunload} /> -->

<TopBar>
	<button use:melt={$trigger} class="p-2 pl-1 rounded-full">
		<ThreeDotsVertical class="w-8 h-8" />
	</button>
	{#if $menuOpen}
		<div
			transition:scale
			use:melt={$menu}
			class="flex-(~ col) gap-3 bg-white z-9999 rounded-lg p-4
			border-(2 black) shadow-lg"
			style="transform-origin: top right;"
		>
			<button
				use:ripple
				use:melt={$item}
				on:click={() => {
					goto('/perfil/alterarEmail');
				}}
				class="dropdown-item"
			>
				<Envelope class="w-8 h-8" />
				Alterar email
			</button>
			<button
				use:ripple
				use:melt={$item}
				on:click={() => {
					logOut();
				}}
				class="dropdown-item"
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
<div class="h-[calc(100svh-3.5rem)] overflow-y-auto">
	<form
		use:form
		on:submit={(e) => {
			onSubmit($data);
		}}
		class="p-6 flex-(~ col) gap-3 rounded-md w-full h-max"
	>
		<!-- {#await $pocketbase.collection('users').getOne($pocketbase.authStore.model?.id)}
			<div>Loading...</div>
		{:then user} -->
		<!-- {@const avatarSrc = ''} -->

		<!-- Avatar -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<div class="flex-(~ col) gap-2 items-center">
			<div class="flex-(~ col) gap-2 items-center">
				<!-- <div class="flex items-end"> -->
				<div
					class="w-32 h-32 rounded-full flex items-center justify-center
								border-(~ gray-700) cursor-pointer"
				>
					{#if profileImgData.src && !$errors.avatar}
						<ImageLazy
							{...profileImgData}
							classNameDiv="rounded-inherit h-full flex w-full items-center justify-center"
							classNameImg="rounded-inherit h-full w-full object-cover"
						>
							<PersonFill class="w-20 h-20" />
						</ImageLazy>
					{:else}
						<ImageLazy
							src={avatarSrc}
							alt="Perfil"
							classNameDiv="rounded-inherit h-full flex w-full items-center justify-center"
							classNameImg="rounded-inherit h-full w-full object-cover"
						>
							<PersonFill class="w-20 h-20" />
						</ImageLazy>
					{/if}
				</div>
				<!-- </div> -->
				{#if $errors.avatar}
					<p transition:slide class="text-red-5 font-semibold">{$errors.avatar[0]}</p>
				{/if}
				<div class="flex gap-2 items-center">
					<h2 class="text-txt-500 font-bold cursor-default">Foto de perfil</h2>
					<label class="w-fit h-fit p-2 border-(~ gray-700) rounded-lg bg-primary-300 z-50">
						<PencilSquare class="w-6 h-6" />
						<input
							type="file"
							accept="image/*"
							name="avatar"
							class="appearance-none"
							style="display: none;"
						/>
					</label>
				</div>
			</div>
		</div>

		<!-- Nome -->
		<div class="flex-(~ col) gap-2">
			<label for="nome" class="block text-lg font-bold">Nome</label>
			{#if user.nome}
				<input
					type="text"
					value={user.nome}
					name="nome"
					id="nome"
					class:invalid={$errors.nome}
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{:else}
				<input
					type="text"
					placeholder="Informe seu nome"
					name="nome"
					id="nome"
					class:invalid={$errors.nome}
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{/if}
			{#if $errors.nome}
				<p transition:slide class="text-red-5 font-semibold">{$errors.nome[0]}</p>
			{/if}
		</div>

		<!-- Data de Nascimento -->
		<div class="flex-(~ col) gap-2">
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
						class:disable-picker={true}
						class:invalid={$errors.dataNascimento}
						class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
					/>
					<!-- {#if isMobileDevie}
							<button
								use:ripple
								type="button"
								on:click={async () => {
									await showNativeDatePicker((date) => {
										dn = date;
									});
								}}
								class="w-25% py-4"
							>
								<CalendarDate class="w-8 h-8 mx-auto" />
							</button>
						{/if} -->
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
						class:invalid={$errors.dataNascimento}
						class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
					/>
					<!-- {#if isMobileDevie}
							<button
								type="button"
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
						{/if} -->
				</div>
			{/if}
			{#if $errors.dataNascimento}
				<p transition:slide class="text-red-5 font-semibold">{$errors.dataNascimento[0]}</p>
			{/if}
		</div>

		<!-- Profissão -->
		<div class="flex-(~ col) gap-2">
			<label for="profissao" class="block text-lg font-bold">Profissão</label>
			{#if user.profissao}
				<input
					type="text"
					value=""
					name="profissao"
					id="profissao"
					class:invalid={$errors.profissao}
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{:else}
				<input
					type="text"
					placeholder="Informe sua profissao"
					name="profissao"
					id="profissao"
					class:invalid={$errors.profissao}
					class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg focus:outline-none focus:ring-2 focus:!ring-primary-500"
				/>
			{/if}
			{#if $errors.profissao}
				<p transition:slide class="text-red-5 font-semibold">{$errors.profissao[0]}</p>
			{/if}
			<!-- svelte-ignore a11y-label-has-associated-control -->
		</div>

		<!-- Email -->
		<div class="flex-(~ col) gap-2">
			<label for="email" class="block text-lg font-bold">Email</label>
			<input
				type="text"
				readonly
				value={user.email}
				name="email"
				id="email"
				class="w-full text-base bg-white ring-2 ring-gray-700 px-2 py-4 rounded-lg
					opacity-70"
			/>

			<!-- svelte-ignore a11y-label-has-associated-control -->
		</div>
		<!-- {/await} -->
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
</div>

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
	.disable-picker::-webkit-calendar-picker-indicator {
		display: none;
	}

	.dropdown-item {
		--uno: w-full flex gap-3 p-2 items-center font-semibold;
		--uno: min-w-56;
	}
</style>
