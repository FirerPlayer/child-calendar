<script lang="ts">
	import { page } from '$app/stores';
	import { addToast } from '$lib/components/Toast.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { pocketbase, titleStore } from '$lib/stores';
	import { sendChangeEmail } from '$lib/validators/usuario';
	import { validator } from '@felte/validator-yup';
	import { createForm } from 'felte';
	import { Envelope } from 'svelte-bootstrap-icons';
	import { ripple } from 'svelte-ripple-action';
	import { slide } from 'svelte/transition';
	import type { InferType } from 'yup';

	titleStore.set('Recuperar senha');

	const { form, errors } = createForm<InferType<typeof sendChangeEmail>>({
		extend: validator({ schema: sendChangeEmail }),
		onSubmit: async (data) => {
			await $pocketbase
				.collection('users')
				.requestPasswordReset(data.email)
				.then((res) => {
					addToast({
						title: 'Email enviado',
						message: 'Um email foi enviado para redefinir sua senha',
						type: 'info'
					});
				})
				.catch((err) => {
					addToast({
						title: 'Erro',
						message: 'Falha ao enviar email',
						type: 'error'
					});
					console.error(err.data);
				});
		}
	});
</script>

<TopBar />

<form use:form class="flex flex-col justify-center w-full h-[calc(100svh-3.5rem)] gap-2 py-4 px-8">
	<div class="flex flex-col gap-2 my-auto">
		<label for="email" class="text-txt-500 font-bold flex items-center gap-3">
			<Envelope class="w-6 h-6" />
			Email de recuperação
		</label>
		<input
			type="email"
			name="email"
			id="email"
			class="w-full px-3 py-4 rounded-4 focus:outline-none focus:ring-2 focus:ring-primary-500 ring-(~ black)"
			placeholder="Digite seu email para recuperação"
			class:invalid={$errors.email}
		/>
		{#if $errors.email}
			<p transition:slide class="text-red-5 font-semibold">{$errors.email[0]}</p>
		{/if}
		<p>
			<span class="font-bold">Obs:</span> Enviaremos um email para redefinir sua senha, verique se colocou
			o email cadastrado.
		</p>
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
