<script lang="ts">
	import Slider from '$lib/components/Slider.svelte';
	import { ripple } from 'svelte-ripple-action';
	import logo from '$lib/assets/logo.webp';
	import {
		CollectionPlay,
		ListCheck,
		Gear,
		QuestionSquare,
		PersonGear,
		PersonFill
	} from 'svelte-bootstrap-icons';
	import { page } from '$app/stores';
	import { addToast } from '$lib/components/Toast.svelte';

	type MenuItem = {
		name: string;
		href: string;
		icon?: typeof Gear;
	};

	let menuItems: MenuItem[] = [
		{
			name: 'Rotinas',
			href: '/rotinas',
			icon: ListCheck
		},
		{
			name: 'Bibiblioteca de mídia',
			href: '/biblioteca',
			icon: CollectionPlay
		},
		{
			name: 'Perfil',
			href: '/perfil',
			icon: PersonFill
		},
		{
			name: 'Configurações',
			href: '/configuracoes',
			icon: Gear
		}
	];
	const myCustomRipple = (node: HTMLElement) => ripple(node);
</script>

<div
	class="bg-gradient-to-t
	from-primary-400
	to-light-3
	flex
	flex-col
	justify-around
	h-100svh
	items-center
	overflow-y-hidden
	"
>
	<div class="w-fit max-w-50% flex flex-col items-center">
		<h1 class="font-[ScholarlyAmbition] text-primary-500 text-8xl">Calendário</h1>
		<img src={logo} alt="Child Calendar" />
	</div>
	<div>
		<h1 class="text-center text-5xl font-bold mb-2">Menu</h1>
		<Slider className="p-2" withNavigation>
			{#each menuItems as item}
				<div class="flex items-center justify-center">
					<a
						use:myCustomRipple
						href={item.href}
						class="flex-(~ col)
						items-center
						w-fit
						bg-accent-500
						rounded-3
						text-white
						p-4"
					>
						<svelte:component this={item.icon} class="w-30 h-30" />
						<span class="text-xl max-w-min text-center font-bold" style="letter-spacing: 4px;"
							>{item.name}</span
						>
					</a>
				</div>
			{/each}
			<!-- {#if perfil?.funcao === 'admin'}
				<div class="flex items-center justify-center">
					<a
						use:myCustomRipple
						href="/admin"
						class="flex-(~ col)
						items-center
						w-fit
						bg-primary-500
						rounded-3
						p-4"
					>
						<PersonBadge class="w-34 h-34" />
						<span class="text-2xl max-w-min text-center font-bold" style="letter-spacing: 4px;">Admin</span>
					</a>
				</div>
			{/if} -->
		</Slider>
	</div>

	{#if $page.data.session}
		<h3>{$page.data.session.user?.email}</h3>
		<h3 class="text-primary bg-gray-3 border-2 border-black p-2 m-2">
			{JSON.stringify($page.data.session.user)}
		</h3>
	{/if}
</div>

<style>
	:global(body, html) {
		overflow-y: hidden;
	}
</style>
