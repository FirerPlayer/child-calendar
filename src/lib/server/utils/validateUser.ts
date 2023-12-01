// import type { UserSelect } from '../models/auth';
import { verify, hash } from '@node-rs/bcrypt';
// import userRepository from '../repository/userRepository';

// export const authorizeAndPersistUserWithEmail = async (
// 	email: string,
// 	password: string
// ): Promise<{ user?: UserSelect; error?: Error }> => {
// 	let { res: user, error } = await userRepository.findUserByEmail(email);
// 	if (error) {
// 		if (error.message === 'Usuário não encontrado') {
// 			const hashedPassword = await hashPassword(password);
// 			let { res: newUser, error: errorCreate } = await userRepository.createUser({
// 				email,
// 				password: hashedPassword
// 			});
// 			if (errorCreate) {
// 				return { error: errorCreate };
// 			}
// 			return { user: newUser };
// 		}
// 		return { error };
// 	}
// 	if (!user) {
// 		return { error: new Error('Erro ao autenticar e persistir usuário') };
// 	}
// 	let valid = await verify(password, user.password as string);
// 	return valid ? { user } : { error: new Error('Senha inválida') };
// };

export const hashPassword = async (password: string) => {
	return await hash(password);
};
