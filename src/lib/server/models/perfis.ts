import { pgEnum, pgTable, text, timestamp, uuid, type PgEnum } from 'drizzle-orm/pg-core';

export type PerfisSelect = typeof perfis.$inferSelect;
export type PerfisInsert = typeof perfis.$inferInsert;
export type PerfisUpdate = {
	nome?: string;
	nomeUsuario?: string;
	dataNascimento?: Date;
	funcao?: (typeof funcoes.enumValues)[number];
	cargo?: string;
};

export const funcoes = pgEnum('funcoes', ['supervisor', 'cuidador', 'admin']);
export const perfis = pgTable('perfis', {
	userId: text('user_id').notNull().primaryKey(),
	nome: text('nome').notNull(),
	nomeUsuario: text('nome_usuario').notNull(),
	dataNascimento: timestamp('data_nascimento'),
	funcao: funcoes('funcao').notNull().default('supervisor'),
	cargo: text('cargo'),
	criadoEm: timestamp('criado_em').notNull().defaultNow(),
	atualizadoEm: timestamp('atualizado_em').notNull().defaultNow()
});
