import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { perfis } from './perfis';

export type ImagensInsert = typeof imagens.$inferInsert;
export type ImagensSelect = typeof imagens.$inferSelect;

export const imagens = pgTable('imagens', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	userId: text('userId')
		.notNull()
		.references(() => perfis.userId),
	nome: text('nome'),
	bucket: text('bucket').notNull().default('imagens'),
	path: text('url').notNull()
});
