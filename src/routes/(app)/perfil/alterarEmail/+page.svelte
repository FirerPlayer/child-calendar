<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { addToast } from '$lib/components/Toast.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { pocketbase, titleStore } from '$lib/stores';
	import { confirmEmailChange, sendChangeEmail } from '$lib/validators/usuario';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import { ripple } from 'svelte-ripple-action';
	import { slide } from 'svelte/transition';
	import type { InferType } from 'yup';

	titleStore.set('Alterar email');
	let hasToken = $page.url.searchParams.has('token');
	const sendEmailChangeRequest = async (email: string) => {
		await $pocketbase
			.collection('users')
			.requestEmailChange(email)
			.then((res) => {
				addToast({
					title: 'Email enviado',
					message: 'Um email foi enviado com o código',
					type: 'info'
				});
			})
			.catch((err) => {
				if (err.status === 400) {
					if (err.data.data.newEmail) {
						addToast({
							title: 'Erro',
							message: 'Email já registrado.',
							type: 'error'
						});
						return;
					}
					addToast({
						title: 'Erro',
						message: 'Falha ao enviar email',
						type: 'error'
					});
					// console.log(Object.entries(err.data));
				} else {
					addToast({
						title: 'Erro',
						message: 'Ocorreu um erro inesperado',
						type: 'error'
					});
					console.error(err);
				}
			});
	};

	const { form: sendEmailForm, errors: sendEmailErrors } = createForm<
		InferType<typeof sendChangeEmail>
	>({
		extend: validator({ schema: sendChangeEmail }),
		onSubmit: async (data) => {
			await sendEmailChangeRequest(data.email);
		}
	});

	// const { form: confirmEmailForm, errors: confirmEmailErrors } = createForm<
	// 	InferType<typeof confirmEmailChange>
	// >({
	// 	extend: validator({ schema: confirmEmailChange }),
	// 	onSubmit: async (data) => {
	// 		const token = $page.url.searchParams.get('token') as string;
	// 		await $pocketbase
	// 			.collection('users')
	// 			.confirmEmailChange(token, data.password)
	// 			.then((res) => {
	// 				addToast({
	// 					title: 'Email alterado',
	// 					message: 'Email alterado com sucesso',
	// 					type: 'success'
	// 				});
	// 				setTimeout(() => {
	// 					goto('/');
	// 				}, 2000);
	// 			})
	// 			.catch((err) => {
	// 				addToast({
	// 					title: 'Erro',
	// 					message: 'Ocorreu um erro',
	// 					type: 'error'
	// 				});
	// 				console.log(err);
	// 			});
	// 	}
	// });
</script>

<TopBar />
<!-- {#if hasToken}
	<form
		use:confirmEmailForm
		class="flex flex-col justify-center w-full h-[calc(100svh-3.5rem)] gap-2 py-4 px-8"
	>
		<div class="flex flex-col gap-2 my-auto">
			<label for="password" class="text-txt-500 font-bold">Confirme a alteração com sua senha</label
			>
			<input
				data-felte-keep-on-remove
				type="password"
				name="password"
				id="password"
				class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
				placeholder="Digite sua senha"
				class:invalid={$confirmEmailErrors.password}
			/>
			{#if $confirmEmailErrors.password}
				<p transition:slide class="text-red-5 font-semibold">{$confirmEmailErrors.password[0]}</p>
			{/if}
		</div>
		<button
			use:ripple
			type="submit"
			class="button flex items-center justify-center gap-5 !p-5
  text-2xl !focus:ring-primary-800 mt-auto"
		>
			Salvar
		</button>
	</form>
{:else} -->
<form
	use:sendEmailForm
	class="flex flex-col justify-center w-full h-[calc(100svh-3.5rem)] gap-2 py-4 px-8"
>
	<div class="flex flex-col gap-2 my-auto">
		<label for="email" class="text-txt-500 font-bold">Novo email</label>
		<input
			type="email"
			name="email"
			id="email"
			class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
			placeholder="Digite seu email"
			class:invalid={$sendEmailErrors.email}
		/>
		{#if $sendEmailErrors.email}
			<p transition:slide class="text-red-5 font-semibold">{$sendEmailErrors.email[0]}</p>
		{/if}
	</div>
	<button
		use:ripple
		type="submit"
		class="button flex items-center justify-center gap-5 !p-5
    text-2xl !focus:ring-primary-800 mt-auto"
	>
		Enviar email
	</button>
</form>

<!-- {/if} -->

<style>
	.invalid {
		--uno: ring-2 ring-red-5;
	}
</style>
