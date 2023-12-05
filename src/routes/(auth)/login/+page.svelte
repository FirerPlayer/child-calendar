<script lang="ts">
	import logo from '$lib/assets/logo.webp';
	import { userLoginEmail } from '$lib/validators/rotinas';
	import { createForm } from 'felte';
	import { BoxArrowInRight, Google } from 'svelte-bootstrap-icons';
	import type { InferType } from 'yup';
	import { validator } from '@felte/validator-yup';
	import { slide } from 'svelte/transition';
	import { pocketbase, titleStore } from '$lib/stores';
	import { getContext } from 'svelte';
	import type Pocketbase from 'pocketbase';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/components/Toast.svelte';
	import { createSeparator, melt } from '@melt-ui/svelte';
	import { ripple } from 'svelte-ripple-action';
	import LoaderSvg from '$lib/components/LoaderSVG.svelte';

	let {
		elements: { root: horizontal }
	} = createSeparator({
		orientation: 'horizontal'
	});

	const { form, errors } = createForm<InferType<typeof userLoginEmail>>({
		extend: validator({ schema: userLoginEmail }),
		async onSubmit({ email, password }) {
			console.log('values: ', { email, password });
			await $pocketbase
				.collection('users')
				.authWithPassword(email, password)
				.then((res) => {
					goto('/');
				})
				.catch((err) => {
					if (err.status === 400) {
						addToast({
							title: 'Erro',
							message: 'Email ou senha inválidos',
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
		}
	});
	titleStore.set('Login');
	let googleOpening = false;

	const handleGoogle = async () => {
		googleOpening = true;
		await $pocketbase
			.collection('users')
			.authWithOAuth2({
				provider: 'google',
				redirect: 'follow'
			})
			.then((res) => {
				goto('/');
			});
		googleOpening = false;
	};
</script>

<div
	class="flex flex-col justify-center items-center h-100lvh
text-txt-500 bg-bb-500"
>
	<img src={logo} alt="Child calendar logo" class="w-50" />
	<h1 class="text-7xl font-[SuperBoy] text-orange-500" style="letter-spacing: 4px;">LOGIN</h1>
	<form use:form class="flex flex-col justify-center w-full gap-4 py-4 px-8">
		<div class="flex flex-col gap-2">
			<label for="email" class="text-txt-500 font-bold">Email</label>
			<input
				type="email"
				name="email"
				class="w-full p-5 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Digite seu email"
				class:invalid={$errors.email}
			/>
			{#if $errors.email}
				<p transition:slide class="text-red-5 font-semibold">{$errors.email[0]}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<label for="password" class="text-txt-500 font-bold">Senha</label>
			<input
				type="password"
				name="password"
				class="w-full p-5 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Digite sua senha"
				class:invalid={$errors.password}
			/>
			{#if $errors.password}
				<p transition:slide class="text-red-5 font-semibold">{$errors.password[0]}</p>
			{/if}
		</div>
		<button
			use:ripple
			type="submit"
			class="button flex items-center justify-center gap-5 !p-5
			text-2xl !focus:ring-primary-800"
		>
			<BoxArrowInRight class="w-8 h-8" />
			Logar
		</button>
	</form>
	<a
		href="/registro"
		class="text-txt-500 font-semibold underline
	text-lg">Não tem uma conta? Crie uma</a
	>
	<div class="grid place-items-center w-full my-1.5rem px-8">
		<div use:melt={$horizontal} class="w-full h-2px bg-txt-500"></div>
		<span
			class="px-2 bg-bb-500 uppercase w-fit absolute
		font-semibold text-xl">ou</span
		>
	</div>
	<div>
		<h2 class="text-xl font-semibold text-center mb-1rem">Entre com</h2>
		<button
			on:click={handleGoogle}
			use:ripple
			class="rounded-4 flex items-center gap-3 !p-3 !bg-light-5
			border-(~ black) focus:ring-2 focus:ring-primary-500"
		>
			{#if googleOpening}
				<LoaderSvg class="w-8 h-8 text-red-5" />
			{:else}
				<Google class="w-8 h-8 text-red-5" />
			{/if}
			Google
		</button>
	</div>
</div>

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
</style>
