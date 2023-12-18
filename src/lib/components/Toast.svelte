<script lang="ts" context="module">
	export type ToastData = {
		title: string;
		message: string;
		type: 'success' | 'error' | 'info' | 'warning';
	};

	const {
		elements: { content, title, description, close },
		helpers,
		states: { toasts },
		actions: { portal }
	} = createToaster<ToastData>();

	export const addToast = (data: ToastData) => helpers.addToast({ data });
</script>

<script lang="ts">
	import { createToaster, melt } from '@melt-ui/svelte';
	import {
		CheckCircleFill,
		ExclamationCircleFill,
		InfoCircleFill,
		X,
		XCircleFill
	} from 'svelte-bootstrap-icons';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
</script>

<div use:portal class="w-full fixed top-0 z-9999 flex flex-col items-end gap-2">
	{#each $toasts as { id, data } (id)}
		<div
			use:melt={$content(id)}
			animate:flip={{ duration: 500 }}
			in:fly={{ duration: 150, x: '100%' }}
			out:fly={{ duration: 150, x: '100%' }}
			class="bg-cyan-200 text-txt-500 shadow-md w-full flex-col flex"
		>
			<div class="relative flex items-center justify-between py-5 px-2">
				<div class="flex gap-5 items-center">
					{#if data.type === 'success'}
						<CheckCircleFill class="w-10 h-10 text-green-500 rounded-full" />
					{/if}
					{#if data.type === 'error'}
						<XCircleFill class="w-10 h-10 text-red-500 rounded-full" />
					{/if}
					{#if data.type === 'info'}
						<InfoCircleFill class="w-10 h-10 text-primary-500 rounded-full" />
					{/if}
					{#if data.type === 'warning'}
						<ExclamationCircleFill class="w-10 h-10 text-accent-500 rounded-full" />
					{/if}

					<div class="flex flex-col gap-1 max-w-56 overflow-hidden">
						<h3 use:melt={$title(id)} class="text-lg px-5 py-1 font-semibold bg-dark/30 rounded-md">
							{data.title}
						</h3>
						<p use:melt={$description(id)} class="text-base">
							{data.message}
						</p>
					</div>
				</div>
				<button
					use:melt={$close(id)}
					aria-label="Fechar notificaçã"
					class="p-1 rounded-full self-start bg-secondary-400 z-60"
				>
					<X class="w-6 h-6" />
				</button>
			</div>
		</div>
	{/each}
</div>
