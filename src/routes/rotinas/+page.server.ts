import type { criarRotina } from '$lib/validators/rotinas';
import type { Actions } from '@sveltejs/kit';
import type { InferType } from 'yup';

export const actions: Actions = {
	criarRotina: async ({ request }) => {
		type CriarForm = InferType<typeof criarRotina>;
		const data = Object.fromEntries(await request.formData()) as unknown as CriarForm;
		console.log(data);
	}
};
