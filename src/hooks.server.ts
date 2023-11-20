import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private';
import Credentials from '@auth/core/providers/credentials';
import { validateUserWithEmail } from '$lib/server/utils/validateUser';
import type { UserSelect } from '$lib/server/models/auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import db from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const handle = SvelteKitAuth({
	trustHost: true,
	adapter: DrizzleAdapter(db),
	providers: [
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET,
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name,
					email: profile.email,
					image: profile.avatar_url,
					role: profile.role ?? 'aluno'
				};
			}
		}),
		Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET
		}),
		Credentials({
			name: 'loginEmail',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize({ email, password }) {
				return (await validateUserWithEmail(
					email as string,
					password as string
				)) as UserSelect | null;
			}
		})
	],
	events: {
		signIn(message) {
			console.log('logado');
			throw redirect(302, '/');
		}
	}
});
