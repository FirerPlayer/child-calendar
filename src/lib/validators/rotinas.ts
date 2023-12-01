import { string, object, date } from 'yup';
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
	email: string().email('Email inválido').required('Email inválido'),
	password: string().required().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
	confirmPassword: string().test(
		'passwords-match',
		'As senhas precisam ser iguais',
		(value, context) => {
			return value === context.parent.password;
		}
	)
});
