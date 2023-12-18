import { mixed, object, string } from 'yup';

export const criarImagem = object({
	nome: string().required().min(4, 'Nome muito curto'),
	data: mixed((input: File): input is File => input instanceof File)
		.test('maxSize', 'Imagem pode ter no máximo 5MB', (value) => {
			if (value instanceof File) {
				return value.size <= 5 * 1024 * 1024;
			}
			return true;
		})
		.required('A imagem deve ser selecionada')
});

export const criarSom = object({
	nome: string().required().min(4, 'Nome muito curto'),
	data: mixed((input: File): input is File => input instanceof File)
		.test('maxSize', 'O aúdio pode ter no máximo 5MB', (value) => {
			if (value instanceof File) {
				return value.size <= 5 * 1024 * 1024;
			}
			return true;
		})
		.required('O aúdio deve ser selecionado')
});
