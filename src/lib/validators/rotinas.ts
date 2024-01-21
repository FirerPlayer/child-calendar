import { string, object, date, mixed, ref, number } from 'yup';
export const criarRotinaForm = object({
	nome: string().required().min(2, 'Nome muito curto'),
	descricao: string(),
	dataInicio: string().notRequired(),
	dataFim: string().notRequired(),
	somEstimulo: string().notRequired(),
	// complexidade: string().oneOf(['baixa', 'media', 'alta', 'muito_alta']),
	// tarefas: object({
	// 	descricaao: string().min(4, 'Descrição muito curta')
	// }).notRequired(),
	estado: string().oneOf(['desativado', 'pendente', 'concluido', 'executando'])
});

export const atualizarRotinaForm = object({
	nome: string().required().min(2, 'Nome muito curto'),
	descricao: string(),
	dataInicio: string().notRequired(),
	dataFim: string().notRequired(),
	somEstimulo: string().notRequired(),
	imagem: string().notRequired(),
	// complexidade: string().oneOf(['baixa', 'media', 'alta', 'muito_alta']),
	// tarefas: object({
	// 	descricaao: string().min(4, 'Descrição muito curta')
	// }).notRequired(),
	estado: string().oneOf(['desativado', 'pendente', 'concluido', 'executando'])
});
