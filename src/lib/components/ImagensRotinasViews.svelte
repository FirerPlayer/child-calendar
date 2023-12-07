<script lang="ts">
	import { draggable } from '$lib/actions';
	import { draggingState, offDragging, onDragging } from '$lib/stores';
	import { slide } from 'svelte/transition';

	let draggableDiv: HTMLElement;

	let { dx, dy } = { dx: 0, dy: 0 };
	const handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		onDragging({ data: 'test' });
		const startPos = {
			x: e.clientX - dx,
			y: e.clientY - dy
		};
		const element = e.target as HTMLElement;
		const rect = element.getBoundingClientRect();
		let { initialWidth, initialHeight } = { initialWidth: rect.width, initialHeight: rect.height };

		const handleMouseMove = (e: MouseEvent) => {
			const dx = e.clientX - startPos.x;
			const dy = e.clientY - startPos.y;

			element.style.position = 'absolute';
			element.style.zIndex = '50';
			element.style.transform = `translate(${dx}px, ${dy}px)`;
			element.style.width = `${initialWidth}px`;
			element.style.height = `${initialHeight}px`;
		};

		const handleMouseUp = () => {
			offDragging();
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			element.style.position = 'static';
			element.style.zIndex = '0';
			element.style.transform = `translate(0px, 0px)`;
			element.style.width = `${initialWidth}px`;
			element.style.height = `${initialHeight}px`;
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		onDragging({ data: 'test' });
		const touch = e.touches[0];

		const startPos = {
			x: touch.clientX - dx,
			y: touch.clientY - dy
		};
		const element = e.target as HTMLElement;
		const rect = element.getBoundingClientRect();
		let { initialWidth, initialHeight } = { initialWidth: rect.width, initialHeight: rect.height };

		const handleTouchMove = (e: TouchEvent) => {
			const touch = e.touches[0];
			const dx = touch.clientX - startPos.x;
			const dy = touch.clientY - startPos.y;

			element.style.position = 'absolute';
			element.style.zIndex = '50';
			element.style.transform = `translate(${dx}px, ${dy}px)`;
			element.style.width = `${initialWidth}px`;
			element.style.height = `${initialHeight}px`;
		};

		const handleTouchEnd = () => {
			offDragging();
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
			element.style.position = 'static';
			element.style.zIndex = '0';
			element.style.transform = `translate(0px, 0px)`;
			element.style.width = `${initialWidth}px`;
			element.style.height = `${initialHeight}px`;
		};

		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
	};

	function movable(node: HTMLElement, data: Record<string, any> = {}) {
		node.addEventListener('mousedown', handleMouseDown);
		node.addEventListener('touchstart', handleTouchStart);
	}
</script>

<div
	class="w-full bg-secondary-300 rounded-4 p-2 shadow-md
grid grid-cols-3 grid-flow-row md:grid-cols-5 gap-4 overflow-y-scroll rounded-4"
>
	{#each Array.from({ length: 20 }) as _, i}
		<div class="flex flex-col gap-2px items-center">
			<!-- use:draggable={{
					data: `rotina ${i}`
				}} -->
			<div use:movable class="border-(~ black) rounded-4 touch-none select-none">
				<img
					draggable="false"
					src="https://placehold.co/400"
					alt="rotina {i}"
					title="rotina {i}"
					class="rounded-inherit pointer-events-none"
				/>
			</div>
			{#if !$draggingState.on}
				<h3 transition:slide={{ duration: 500, axis: 'y' }}>Rotina {i}</h3>
			{/if}
		</div>
	{/each}
</div>
