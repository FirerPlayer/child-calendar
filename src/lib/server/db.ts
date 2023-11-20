import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import postgres from 'postgres';
import {
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
	POSTGRES_USER
} from '$env/static/private';

const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { logger: true });
await migrate(db, { migrationsFolder: './sql/migrations' });

export default db;
