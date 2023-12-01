import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, eq, sql } from 'drizzle-orm';
import {
	rotinas,
	type RotinaInsert,
	type RotinaSelect,
	type RotinaUpdate
} from '../models/rotinas';
import db from '../db';
import type { Output } from './types';

type OutputRotinasRepository = Output<RotinaSelect | RotinaSelect[]>;
function createRotinasRepository(db: PostgresJsDatabase) {
	return {
		async createRotina(novaRotina: RotinaInsert): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				let o = await db.insert(rotinas).values(novaRotina).returning();
				if (!o.length) {
					out.error = new Error('Erro ao criar rotina');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao criar rotina', {
					cause: error
				});
			}
			return out;
		},
		async findRotinaById(id: string): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				let o = await db.select().from(rotinas).where(eq(rotinas.id, id));
				if (!o.length) {
					out.error = new Error('Rotina não encontrada');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar rotina pelo id', {
					cause: error
				});
			}
			return out;
		},
		async listRotinasByUserId(
			userId: string,
			limit: number = 20,
			offset: number = 0
		): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				out.res = await db
					.select()
					.from(rotinas)
					.where(eq(rotinas.userId, userId))
					.offset(offset)
					.limit(limit);
				if (!out.res.length) {
					out.error = new Error('Rotinas não encontrada pelo userId');
					out.res = undefined;
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar rotinas pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async updateRotinaById(id: string, novaRotina: RotinaUpdate): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				let o = await db
					.update(rotinas)
					.set({
						...novaRotina,
						atualizadoEm: new Date()
					})
					.where(eq(rotinas.id, id))
					.returning();
				if (!o.length) {
					out.error = new Error('Rotina não encontrada');
					out.res = undefined;
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao atualizar rotina', {
					cause: error
				});
			}
			return out;
		},
		async listRotinasNoAnoByUserId(userId: string, ano: number): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				out.res = await db
					.select()
					.from(rotinas)
					.where(
						and(eq(rotinas.userId, userId), sql`EXTRACT(YEAR FROM ${rotinas.dataInicio}) = ${ano}`)
					);
				if (!out.res.length) {
					out.error = new Error('Rotinas não encontradas pelo userId ou pelo ano');
					out.res = undefined;
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar rotinas pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async listRotinasNoMesByUserId(
			userId: string,
			ano: number,
			mes: number
		): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				out.res = await db
					.select()
					.from(rotinas)
					.where(
						and(
							eq(rotinas.userId, userId),
							sql`EXTRACT(YEAR FROM ${rotinas.dataInicio}) = ${ano}`,
							sql`EXTRACT(MONTH FROM ${rotinas.dataInicio}) = ${mes}`
						)
					);
				if (!out.res.length) {
					out.error = new Error('Rotinas não encontradas pelo userId ou pelo mes');
					out.res = undefined;
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar rotinas pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async listRotinasNoDiaByUserId(
			userId: string,
			ano: number,
			mes: number,
			dia: number
		): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				out.res = await db
					.select()
					.from(rotinas)
					.where(
						and(
							eq(rotinas.userId, userId),
							sql`EXTRACT(YEAR FROM ${rotinas.dataInicio}) = ${ano}`,
							sql`EXTRACT(MONTH FROM ${rotinas.dataInicio}) = ${mes}`,
							sql`EXTRACT(DAY FROM ${rotinas.dataInicio}) = ${dia}`
						)
					);
				if (!out.res.length) {
					out.error = new Error('Rotinas não encontradas pelo userId ou pelo dia');
					out.res = undefined;
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar rotinas pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async deleteRotinaById(id: string): Promise<OutputRotinasRepository> {
			let out: OutputRotinasRepository = {};
			try {
				let o = await db.delete(rotinas).where(eq(rotinas.id, id)).returning();
				if (!o.length) {
					out.error = new Error('Rotina não encontrada');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao deletar rotina', {
					cause: error
				});
			}
			return out;
		}
	};
}

const rotinasRepository = createRotinasRepository(db);
export default rotinasRepository;
