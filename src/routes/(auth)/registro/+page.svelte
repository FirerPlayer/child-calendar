<script lang="ts">
	import { userRegisterEmail } from '$lib/validators/usuario';
	import { createForm } from 'felte';
	import { PersonFill, RocketTakeoff } from 'svelte-bootstrap-icons';
	import type { InferType } from 'yup';
	import { validator } from '@felte/validator-yup';
	import { slide } from 'svelte/transition';
	import { pocketbase, titleStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/components/Toast.svelte';
	import { ripple } from 'svelte-ripple-action';
	import ImageLazy from '$lib/components/ImageLazy.svelte';

	const { form, errors, data } = createForm<InferType<typeof userRegisterEmail>>({
		extend: validator({ schema: userRegisterEmail }),
		async onSubmit(formData) {
			if (!pocketbase) {
				return;
			}
			await $pocketbase
				.collection('users')
				.create(formData)
				.then(() => {
					goto('/');
				})
				.then((res) => {
					addToast({
						title: 'Sucesso',
						message: 'Conta criada com sucesso, agora faça o login.',
						type: 'success'
					});
					setTimeout(() => {
						goto('/login');
					}, 1000);
				})
				.catch((err) => {
					if (err.status === 400) {
						if (err.data.data.email) {
							addToast({
								title: 'Erro',
								message: 'Email já registrado, faça o login',
								type: 'error'
							});
							return;
						}
						addToast({
							title: 'Erro',
							message: 'Falha ao registrar: ',
							type: 'error'
						});
					} else {
						addToast({
							title: 'Erro',
							message: 'Ocorreu um erro inesperado',
							type: 'error'
						});
						console.error(err);
					}
				});
		},
		onError(error) {
			console.log('error at registro: ', error);
		}
	});
	titleStore.set('Registro');

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
</script>

<div
	class="flex flex-col justify-start items-center h-100lvh
	overflow-y-hidden text-txt-500 bg-bb-500"
>
	<!-- <img src={logo} alt="Child calendar logo" class="w-50" /> -->
	<h1 class="text-5xl font-[SuperBoy] text-orange-500" style="letter-spacing: 4px;">REGISTRO</h1>
	<!-- svelte-ignore a11y-missing-attribute -->
	<form use:form class="flex flex-col justify-center w-full gap-2 py-2 px-8">
		<!-- AVATAR -->
		<div class="flex flex-col gap-2 items-center">
			<label
				use:ripple
				class="w-28 h-28 rounded-full flex items-center justify-center
					border-(~ dark-500) cursor-pointer"
				class:border-red-5={$errors.avatar}
			>
				{#if profileImgData.src != '' && !$errors.avatar}
					<ImageLazy {...profileImgData}>
						<PersonFill class="w-20 h-20" />
					</ImageLazy>
					<!-- <img {...profileImgData} /> -->
				{:else}
					<PersonFill class="w-20 h-20" />
				{/if}
				<!-- <img src="https://placehold.co/400" alt="perfil" class="rounded-inherit" /> -->
				<input
					type="file"
					accept="image/*"
					name="avatar"
					class="appearance-none"
					style="display: none;"
				/>
			</label>
			<span class="text-txt-500 font-bold cursor-default">Foto de perfil</span>

			{#if $errors.avatar}
				<p transition:slide class="text-red-5 font-semibold">{$errors.avatar[0]}</p>
			{/if}
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
		<!-- EMAIL -->
		<div class="flex flex-col gap-2">
			<label for="email" class="text-txt-500 font-bold">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Digite seu email"
				class:invalid={$errors.email}
			/>
			{#if $errors.email}
				<p transition:slide class="text-red-5 font-semibold">{$errors.email[0]}</p>
			{/if}
		</div>

		<!-- {#if currStep === 1} -->
		<!-- SENHA -->
		<div class="flex flex-col gap-2" style="dispalay: none;">
			<label for="password" class="text-txt-500 font-bold">Senha</label>
			<input
				type="password"
				id="password"
				name="password"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Digite sua senha"
				class:invalid={$errors.password}
			/>
			{#if $errors.password}
				<p transition:slide class="text-red-5 font-semibold">{$errors.password[0]}</p>
			{/if}
		</div>
		<!-- CONFIRMAR SENHA -->
		<div class="flex flex-col gap-2" style="disaplay: none;">
			<label for="passwordConfirm" class="text-txt-500 font-bold">Comfirmar senha</label>
			<input
				type="password"
				id="passwordConfirm"
				name="passwordConfirm"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Confirme sua senha"
				class:invalid={$errors.passwordConfirm}
			/>
			{#if $errors.passwordConfirm}
				<p transition:slide class="text-red-5 font-semibold">{$errors.passwordConfirm[0]}</p>
			{/if}
		</div>
		<!-- {/if} -->
		<button
			use:ripple
			type="submit"
			class="flex items-center justify-center gap-3 p-4 mt-2 text-2xl
			focus:ring-2 !focus:ring-primary-800 bg-primary-500 rounded-full"
		>
			<RocketTakeoff class="w-8 h-8" />
			Começar
		</button>
	</form>
	<a href="/login" class="fixed bottom-2 text-txt-500 font-semibold underline text-lg"
		>Já tem uma conta? Faça login</a
	>
</div>

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
</style>
