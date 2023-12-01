// import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { users, type UserInsert, type UserSelect } from '../models/auth';
// import { eq } from 'drizzle-orm';
// import db from '../db';
// import { hashPassword } from '../utils/validateUser';
// import type { Output } from './types';

// type OutputUserRepository = Output<UserSelect>;
// function createUserRepository(db: PostgresJsDatabase) {
// 	return {
// 		async createUser(user: UserInsert): Promise<OutputUserRepository> {
// 			let out: OutputUserRepository = {};
// 			try {
// 				let o = await db.insert(users).values(user).returning();
// 				if (!o.length) {
// 					out.error = new Error('Erro ao criar usuário');
// 				} else {
// 					out.res = o[0];
// 				}
// 			} catch (error) {
// 				out.error = new Error('Erro ao criar usuário', {
// 					cause: error
// 				});
// 			}
// 			return out;
// 		},
// 		async findUserById(id: string): Promise<OutputUserRepository> {
// 			let out: OutputUserRepository = {};
// 			try {
// 				let o = await db.select().from(users).where(eq(users.id, id));
// 				if (!o.length) {
// 					out.error = new Error('Usuário não encontrado');
// 				} else {
// 					out.res = o[0];
// 				}
// 			} catch (error) {
// 				out.error = new Error('Erro ao buscar usuário pelo id', {
// 					cause: error
// 				});
// 			}
// 			return out;
// 		},
// 		async findUserByEmail(email: string): Promise<OutputUserRepository> {
// 			let out: OutputUserRepository = {};
// 			try {
// 				let o = await db.select().from(users).where(eq(users.email, email));
// 				if (!o.length) {
// 					out.error = new Error('Usuário não encontrado');
// 				} else {
// 					out.res = o[0];
// 				}
// 			} catch (error) {
// 				out.error = new Error('Erro ao buscar usuário pelo email', {
// 					cause: error
// 				});
// 			}
// 			return out;
// 		}
// 	};
// }

// const userRepository = createUserRepository(db);
// export default userRepository;
