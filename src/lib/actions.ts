import { offDragging, onDragging } from './stores';

export type DraggableOptions = {
	data: string;
	onDragstart?: (data: string, e: DragEvent) => void;
	onDragend?: (data: string, e: DragEvent) => void;
};

export type DropzoneOptions = {
	dropEffect: string;
	dragoverClass: string;
	onDropzone?: (data: string, e: DragEvent) => void;
	onDragenter?: (e: DragEvent) => void;
	onDragleave?: (e: DragEvent) => void;
};

export function dropzone(
	node: HTMLElement,
	options: DropzoneOptions = {
		dropEffect: 'move',
		dragoverClass: 'droppable'
	}
) {
	const listners = {
		dragenter: (e: DragEvent) => {
			(e.target as HTMLElement).classList.add(options.dragoverClass);
			if (options.onDragenter) {
				options.onDragenter(e);
			}
		},
		dragleave: (e: DragEvent) => {
			(e.target as HTMLElement).classList.remove(options.dragoverClass);
			if (options.onDragleave) {
				options.onDragleave(e);
			}
		},
		dragover: (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer) return;
			e.dataTransfer.dropEffect = options.dropEffect as 'move';
		},
		drop: (e: DragEvent) => {
			e.preventDefault();
			if (!e.dataTransfer) return;
			const data = e.dataTransfer.getData('text/plain');
			(e.target as HTMLElement).classList.remove(options.dragoverClass);
			if (options.onDropzone) {
				options.onDropzone(data, e);
			}
		}
	};

	Object.entries(listners).forEach(([key, fn]) => {
		node.addEventListener(key as keyof HTMLElementEventMap, fn as any);
	});

	return {
		update(opt: DropzoneOptions) {
			options = opt;
		},

		destroy() {
			Object.entries(listners).forEach(([key, fn]) => {
				node.removeEventListener(key as keyof HTMLElementEventMap, fn as any);
			});
		}
	};
}

const getHandler = (data: Record<string, any> = {}, { dx, dy }: { dx: number; dy: number }) => {
	const handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		onDragging(data);
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

	const handleTouchStart = (ev: TouchEvent) => {
		ev.preventDefault();
		onDragging({ data: 'test' });
		const touch = ev.touches[0];

		const startPos = {
			x: touch.clientX - dx,
			y: touch.clientY - dy
		};
		const element = ev.target as HTMLElement;
		const rect = element.getBoundingClientRect();
		let { initialWidth, initialHeight } = { initialWidth: rect.width, initialHeight: rect.height };

		const handleTouchMove = (ev: TouchEvent) => {
			const touch = ev.touches[0];
			const dx = touch.clientX - startPos.x;
			const dy = touch.clientY - startPos.y;

			element.style.position = 'absolute';
			element.style.zIndex = '50';
			element.style.transform = `translate(${dx}px, ${dy}px)`;
			element.style.width = `${initialWidth}px`;
			element.style.height = `${initialHeight}px`;
		};

		const handleTouchEnd = (ev: TouchEvent) => {
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

	return { handleMouseDown, handleTouchStart };
};

export function movable(node: HTMLElement, data: Record<string, any> = {}) {
	let { dx, dy } = { dx: 0, dy: 0 };
	let { handleMouseDown, handleTouchStart } = getHandler(data, { dx, dy });
	node.addEventListener('mousedown', handleMouseDown);
	node.addEventListener('touchstart', handleTouchStart);
}
