import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { imagens, type ImagensInsert, type ImagensSelect } from '../models/imagens';
import { eq } from 'drizzle-orm';
import db from '../db';
import type { Output } from './types';

type OutputImagensRepository = Output<ImagensSelect | ImagensSelect[]>;

function createimagensRepository(db: PostgresJsDatabase) {
	return {
		async createImagem(novaImagem: ImagensInsert): Promise<OutputImagensRepository> {
			let out: OutputImagensRepository = {};
			try {
				let o = await db.insert(imagens).values(novaImagem).returning();
				if (!o.length) {
					out.error = new Error('Erro ao criar imagem');
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao criar imagem', {
					cause: error
				});
			}
			return out;
		},
		async findImagemById(id: string): Promise<OutputImagensRepository> {
			let out: OutputImagensRepository = {};
			try {
				let o = await db.select().from(imagens).where(eq(imagens.id, id));
				if (!o.length) {
					out.error = new Error('Imagem não encontrada');
					out.res = undefined;
				} else {
					out.res = o[0];
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar imagem pelo id', {
					cause: error
				});
			}
			return out;
		},
		async listImagensByUserId(userId: string): Promise<OutputImagensRepository> {
			let out: OutputImagensRepository = {};
			try {
				out.res = await db.select().from(imagens).where(eq(imagens.userId, userId));
				if (!out.res.length) {
					out.error = new Error('imagens não encontradas pelo userId');
					out.res = undefined;
				}
			} catch (error) {
				out.error = new Error('Erro ao buscar imagens pelo userId', {
					cause: error
				});
			}
			return out;
		},
		async deleteImagemById(id: string): Promise<OutputImagensRepository> {
			let out: OutputImagensRepository = {};
			try {
				let o = await db.delete(imagens).where(eq(imagens.id, id)).returning();
				if (!o.length) {
					out.error = new Error('Imagem não encontrada');
				}
				out.res = o[0];
			} catch (error) {
				out.error = new Error('Erro ao deletar imagem', {
					cause: error
				});
			}
			return out;
		}
	};
}

const imagensRepository = createimagensRepository(db);
export default imagensRepository;
