import perfisRepository from '$lib/server/repository/perfisRepository';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	return {};
};
