import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sons, type SonsInsert, type SonsSelect } from '../models/sons';
import { eq } from 'drizzle-orm';
import db from '../db';
import type { Output } from './types';

type OutputSonsRepository = Output<SonsSelect | SonsSelect[]>;

function createSonsRepository(db: PostgresJsDatabase) {
	return {
		async createSom(novasom: SonsInsert): Promise<OutputSonsRepository> {
			let out: OutputSonsRepository = {};
			try {
				out.res = (await db.insert(sons).values(novasom).returning())[0];
			} catch (error) {
				out.error = new Error('Erro ao criar som', {
					cause: error
				});
			}
			return out;
		},
		async findSomById(id: string): Promise<OutputSonsRepository> {
			let out: OutputSonsRepository = {};
			try {
				let o = await db.select().from(sons).where(eq(sons.id, id));
				if (!o.length) {
					out.error = new Error('Som não encontrada');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar som pelo id', {
					cause: error
				});
			}
			return out;
		},
		async listSonsByUserId(userId: string): Promise<OutputSonsRepository> {
			let out: OutputSonsRepository = {};
			try {
				let o = await db.select().from(sons).where(eq(sons.userId, userId));
				if (!o.length) {
					out.error = new Error('Sons não encontradas pelo userId');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar sons pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async deleteSomById(id: string): Promise<OutputSonsRepository> {
			let out: OutputSonsRepository = {};
			try {
				let o = await db.delete(sons).where(eq(sons.id, id)).returning();
				if (!o.length) {
					out.error = new Error('Som não encontrada');
				}
				out.res = o[0];
			} catch (error) {
				out.error = new Error('Erro ao deletar som', {
					cause: error
				});
			}
			return out;
		}
	};
}

const sonsRepository = createSonsRepository(db);
export default sonsRepository;
