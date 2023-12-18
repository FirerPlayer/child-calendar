<script lang="ts">
	import { localTimeZone, pocketbase } from '$lib/stores';
	import { ripple } from 'svelte-ripple-action';
	import LoaderSvg from './LoaderSVG.svelte';
	import type { DateValue } from '@internationalized/date';
	import type { RecordModel } from 'pocketbase';

	export let currentDate: DateValue;
	export let rotinas: RecordModel[];
</script>

<div class="flex flex-col gap-4 flex-grow overflow-y-auto">
	{#each rotinas as r, i}
		{@const imagem = r.expand?.imagem}
		{@const rotinaImgSrc = $pocketbase.files.getUrl(imagem, imagem.data)}
		<div use:ripple class="flex gap-3 p-2 rounded-4 min-h-21 shadow-lg bg-primary-200">
			<img src={rotinaImgSrc} alt={r.imagem.nome} class="w-20 h-20 object-cover" />
			<div class="flex flex-col gap-2px box-content">
				<h3 class="text-base font-semibold">{r.nome}</h3>
				<p class="text-sm w-full line-clamp-2 overflow-y-hidden text-ellipsis">
					{r.descricao}
				</p>
				<p class="text-sm opacity-75">{r.dataInicio} - {r.dataFim}</p>
			</div>
		</div>
	{/each}
</div>
