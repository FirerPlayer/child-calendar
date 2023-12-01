import {
	pgTable,
	text,
	uuid,
	primaryKey,
	timestamp,
	boolean,
	pgEnum,
	jsonb
} from 'drizzle-orm/pg-core';
import { imagens } from './imagens';
import { sons } from './sons';
import { perfis } from './perfis';

export type RotinaInsert = typeof rotinas.$inferInsert;
export type RotinaSelect = typeof rotinas.$inferSelect;
export type RotinaUpdate = {
	nome?: string;
	descricao?: string;
	dataInicio?: Date;
	dataFim?: Date;
	estado?: (typeof rotinaEstado.enumValues)[number];
	complexidade?: (typeof complexidade.enumValues)[number];
	somEstimuloId?: string;
	imagemId: string;
	tarefas?: Tarefas[];
};

export type Tarefas = {
	titulo: string;
	descricao: string;
	completo: boolean;
};

export const rotinaEstado = pgEnum('rotina_estado', [
	'desativado',
	'pendente',
	'concluido',
	'executando'
]);

export const complexidade = pgEnum('complexidade', ['baixa', 'media', 'alta', 'muito_alta']);

export const rotinas = pgTable('rotinas', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => perfis.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
	nome: text('nome'),
	descricao: text('descricao'),
	dataInicio: timestamp('data_inicio'),
	dataFim: timestamp('data_fim'),
	imagemId: uuid('imagem_id').references(() => imagens.id),
	somEstimuloId: uuid('som_estimulo_id').references(() => sons.id),
	estado: rotinaEstado('estado').notNull().default('pendente'),
	complexidade: complexidade('complexidade').notNull().default('media'),
	tarefas: jsonb('tarefas').$type<Tarefas[]>(),
	criadoEm: timestamp('criado_em').notNull().defaultNow(),
	atualizadoEm: timestamp('atualizado_em').notNull().defaultNow()
});
