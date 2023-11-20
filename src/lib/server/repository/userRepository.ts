import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { users, type UserInsert, type UserSelect } from '../models/auth';
import { eq } from 'drizzle-orm';
import db from '../db';
import { hashPassword } from '../utils/validateUser';

function createUserRepository(db: PostgresJsDatabase) {
	return {
		async createUser(user: UserInsert): Promise<string> {
			const res = await db
				.insert(users)
				.values({
					...user,
					password: user.password ? await hashPassword(user.password) : undefined
				})
				.returning({ id: users.id });
			return res[0].id;
		},
		async findUserById(id: string): Promise<UserSelect | null> {
			const res = await db.select().from(users).where(eq(users.id, id));
			if (!res.length) {
				return null;
			}
			return res[0];
		},
		async findUserByEmail(email: string): Promise<UserSelect | null> {
			const res = await db.select().from(users).where(eq(users.email, email));
			if (!res.length) {
				return null;
			}
			return res[0];
		}
	};
}

const userRepository = createUserRepository(db);
export default userRepository;
