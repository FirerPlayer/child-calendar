import { date, mixed, object, ref, string } from 'yup';

export const updateUser = object({
	nome: string().required().min(2, 'Nome muito curto'),
	email: string().email('Email inválido').required('Email inválido'),
	avatar: mixed((input): input is File => input instanceof File).test(
		'maxSize',
		'Imagem pode ter no máximo 15MB',
		(value) => {
			if (value instanceof File) {
				return value.size <= 15 * 1024 * 1024;
			}
			return true;
		}
	),
	dataNascimento: string().min(10, 'Data inválida'),
	profissao: string().required().min(3, 'Profissão muito curta')
});
// mixed((input: Date): input is Date => input instanceof Date).test(
// 	'min',
// 	'Data inválida',
// 	(value) => {
// 		if (value instanceof Date) {
// 			return value.getTime() <= new Date().getTime();
// 		}
// 		return true;
// 	}
// ),

export const userLoginEmail = object({
	email: string().required('Email inválido').email('Email inválido'),
	password: string().required().min(6, 'Senha precisa ter no mínimo 6 caracteres')
});

export const userRegisterEmail = object({
	nome: string().required().min(2, 'Nome muito curto'),
	email: string().email('Email inválido').required('Email inválido'),
	password: string().required().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
	passwordConfirm: string()
		.required('Confirme sua senha')
		.oneOf([ref('password')], 'Senhas devem ser iguais'),
	avatar: mixed((input): input is File => input instanceof File).test(
		'maxSize',
		'Imagem pode ter no máximo 15MB',
		(value) => {
			if (value instanceof File) {
				return value.size <= 15 * 1024 * 1024;
			}
			return true;
		}
	)
});
