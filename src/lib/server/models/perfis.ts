import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const funcoes = pgEnum('funcoes', ['supervisor', 'cuidador', 'admin']);
export const perfis = pgTable('perfis', {
	userId: uuid('user_id')
		.notNull()
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	nome: text('nome').notNull(),
	nomeUsuario: text('nome_usuario').notNull().unique(),
	dataNascimento: timestamp('data_nascimento'),
	funcao: funcoes('funcao').notNull().default('supervisor'),
	cargo: text('cargo'),
	criadoEm: timestamp('criado_em').notNull().defaultNow(),
	atualizadoEm: timestamp('atualizado_em').notNull().defaultNow()
});
