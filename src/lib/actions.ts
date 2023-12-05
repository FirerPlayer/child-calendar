import { isDragging } from './stores';

export type DraggableOptions = {
	data: string;
	onDragstart?: (data: string, e: DragEvent) => void;
	onDragend?: (data: string, e: DragEvent) => void;
};

export function draggable(node: HTMLElement, options: DraggableOptions) {
	node.draggable = true;
	node.style.cursor = 'grab';

	const listners = {
		dragstart: (e: DragEvent) => {
			isDragging.set(true);
			if (!e.dataTransfer) return;
			e.dataTransfer.setData('text/plain', options.data);
			if (!options.onDragstart) return;
			options.onDragstart(options.data, e);
		},
		dragend: (e: DragEvent) => {
			// console.log('acabou');
			isDragging.set(false);
			if (!options.onDragend) return;
			options.onDragend(options.data, e);
		}
	};

	Object.entries(listners).forEach(([key, fn]) => {
		node.addEventListener(key as keyof HTMLElementEventMap, fn as any);
	});

	return {
		update(data: string) {
			options.data = data;
		},

		destroy() {
			Object.entries(listners).forEach(([key, fn]) => {
				node.removeEventListener(key as keyof HTMLElementEventMap, fn as any);
			});
		}
	};
}

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
