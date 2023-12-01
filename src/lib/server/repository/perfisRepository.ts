import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import db from '../db';
import { perfis, type PerfisSelect, type PerfisUpdate } from '../models/perfis';
import type { Output } from './types';

type OutputPerfisRepository = Output<PerfisSelect>;

function createPerfisRepository(db: PostgresJsDatabase) {
	return {
		async findPerfilById(userId: string): Promise<OutputPerfisRepository> {
			let out: OutputPerfisRepository = {};
			try {
				let o = await db.select().from(perfis).where(eq(perfis.userId, userId));
				if (!o.length) {
					out.error = new Error('Perfil não encontrado');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar perfil pelo id', {
					cause: error
				});
			}
			return out;
		},
		async findPerfilByNomeUsuario(nomeUsuario: string): Promise<OutputPerfisRepository> {
			let out: OutputPerfisRepository = {};
			try {
				let o = await db.select().from(perfis).where(eq(perfis.nomeUsuario, nomeUsuario));
				if (!o.length) {
					out.error = new Error('Perfil não encontrado');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar perfil pelo nome de usuário', {
					cause: error
				});
			}
			return out;
		},
		async updatePerfilById(id: string, novoPerfil: PerfisUpdate): Promise<OutputPerfisRepository> {
			let out: OutputPerfisRepository = {};
			try {
				let o = await db
					.update(perfis)
					.set({
						...novoPerfil,
						atualizadoEm: new Date()
					})
					.where(eq(perfis.userId, id))
					.returning();
				if (!o.length) {
					out.error = new Error('Perfil não encontrado');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao atualizar perfil', {
					cause: error
				});
			}
			return out;
		}
	};
}

const perfisRepository = createPerfisRepository(db);
export default perfisRepository;
