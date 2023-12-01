<script lang="ts">
	import logo from '$lib/assets/logo.webp';
	import { userLoginEmail } from '$lib/validators/rotinas';
	import { createForm } from 'felte';
	import { BoxArrowInRight } from 'svelte-bootstrap-icons';
	import type { InferType } from 'yup';
	import { validator } from '@felte/validator-yup';
	import { slide } from 'svelte/transition';
	import { titleStore } from '$lib/stores';

	const { form, errors } = createForm<InferType<typeof userLoginEmail>>({
		extend: validator({ schema: userLoginEmail }),
		onSubmit(values) {
			console.log('values: ', values);
		}
	});
	titleStore.set('Login');
</script>

<div class="flex flex-col justify-center items-center gap-10 h-100lvh text-txt-500 bg-bb-500">
	<img src={logo} alt="Child calendar logo" class="w-50" />
	<h1 class="text-8xl font-[SuperBoy] text-orange-500" style="letter-spacing: 4px;">LOGIN</h1>
	<form use:form class="flex flex-col justify-center w-full gap-4 py-4 px-8">
		<div class="flex flex-col gap-2">
			<label for="email" class="text-txt-500 font-bold">Email</label>
			<input
				type="email"
				name="email"
				class="w-full p-5 border border-secondary-300 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
				placeholder="Digite seu email"
				class:invalid={$errors.email}
			/>
			{#if $errors.email}
				<p transition:slide class="text-red-5 font-semibold">{$errors.email[0]}</p>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<label for="password" class="text-txt-500 font-bold">Password</label>
			<input
				type="password"
				name="password"
				class="w-full p-5 border border-secondary-300 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
				placeholder="Digite sua senha"
				class:invalid={$errors.password}
			/>
			{#if $errors.password}
				<p transition:slide class="text-red-5 font-semibold">{$errors.password[0]}</p>
			{/if}
		</div>
		<button type="submit" class="button flex items-center justify-center gap-5 !p-5 text-2xl">
			<BoxArrowInRight class="w-8 h-8" />
			Logar
		</button>
	</form>
</div>

<style>
	.invalid {
		@apply ring-2 ring-red-5;
	}
</style>
