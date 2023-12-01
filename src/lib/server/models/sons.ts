import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { perfis } from './perfis';

export type SonsInsert = typeof sons.$inferInsert;
export type SonsSelect = typeof sons.$inferSelect;

export const sons = pgTable('sons', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	userId: text('userId')
		.notNull()
		.references(() => perfis.userId),
	nome: text('nome'),
	bucket: text('bucket').notNull().default('sons'),
	path: text('url').notNull().unique()
});
