import { string, object, date, mixed, ref } from 'yup';
export const criarRotina = object({
	nome: string().required().min(4, 'Nome muito curto'),
	descricao: string().min(4, 'Descrição muito curta'),
	dataInicio: date(),
	dataFim: date(),
	imagemId: string().min(12),
	somEstimuloId: string().min(12),
	complexidade: string().min(4, 'Complexidade inválida'),
	tarefas: string().min(4, 'Tarefas inválidas')
});

export const userLoginEmail = object({
	email: string().required('Email inválido').email('Email inválido'),
	password: string().required().min(6, 'Senha precisa ter no mínimo 6 caracteres')
});

export const userRegisterEmail = object({
	nome: string().required().min(4, 'Nome muito curto'),
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
