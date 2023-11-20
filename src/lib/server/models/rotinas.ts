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
import { users } from './auth';

export type RotinaInsert = typeof rotinas.$inferInsert;
export type RotinaSelect = typeof rotinas.$inferSelect;

export type Tarefas = {
	titulo: string;
	descricao: string;
	completo: boolean;
};

export const rotina_estado = pgEnum('rotina_estado', [
	'desativado',
	'pendente',
	'concluido',
	'executando'
]);

export const complexidade = pgEnum('complexidade', ['baixa', 'media', 'alta', 'muito_alta']);

export const rotinas = pgTable('rotinas', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	nome: text('nome'),
	descricao: text('descricao'),
	dataInicio: timestamp('data_inicio').notNull(),
	dataFim: timestamp('data_fim'),
	imagemId: uuid('imagem_id').references(() => imagens.id),
	somEstimuloId: uuid('som_estimulo_id').references(() => sons.id),
	estado: rotina_estado('estado').notNull().default('pendente'),
	complexidade: complexidade('complexidade').notNull().default('media'),
	tarefas: jsonb('tarefas').$type<Tarefas[]>(),
	criadoEm: timestamp('criado_em').notNull().defaultNow(),
	atualizadoEm: timestamp('atualizado_em').notNull().defaultNow()
});
