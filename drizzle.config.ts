import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/models/*.ts',
	out: './sql/migrations',
	driver: 'pg'
} satisfies Config;
