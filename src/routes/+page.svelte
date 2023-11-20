<script lang="ts">
	import { CollectionPlay, ListCheck, Gear, QuestionSquare } from 'svelte-bootstrap-icons';
</script>

<div flex="~ row" items-center justify-around gap-10 h-fit min-w-max overflow-x-auto>
	<a href="/rotinas" p-2 rounded-2 flex="~ col" items-center>
		<ListCheck class="w-34 h-34" />
		<span text-2xl max-w-min text-center>Rotinas</span>
	</a>
	<a href="/biblioteca" p-2 rounded-2 flex="~ col" items-center>
		<CollectionPlay class="w-34 h-34" />
		<span text-2xl max-w-min text-center>Bibiblioteca de mídia</span>
	</a>
	<a href="/configuracoes" p-2 rounded-2 flex="~ col" items-center>
		<Gear class="w-34 h-34" />
		<span text-2xl max-w-min text-center>Configurações</span>
	</a>
	<a href="/ajud" p-2 rounded-2 flex="~ col" items-center>
		<QuestionSquare class="w-34 h-34" />
		<span text-2xl max-w-min text-center>Ajuda</span>
	</a>
</div>
