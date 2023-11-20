import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const imagens = pgTable('imagens', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	nome: text('nome'),
	bucket: text('bucket').notNull().default('imagens'),
	path: text('url').notNull().unique()
});
