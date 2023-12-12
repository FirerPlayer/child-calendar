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
