import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const sons = pgTable('sons', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	nome: text('nome'),
	bucket: text('bucket').notNull().default('sons'),
	path: text('url').notNull().unique()
});
