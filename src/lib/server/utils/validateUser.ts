import type { UserSelect } from '../models/auth';
import { verify, hash } from '@node-rs/bcrypt';
import userRepository from '../repository/userRepository';

export const validateUserWithEmail = async (
	email: string,
	password: string
): Promise<null | UserSelect> => {
	let dbUser = await userRepository.findUserByEmail(email);
	if (!dbUser) {
		return null;
	}
	let valid = await verify(password, dbUser.password as string);
	return valid ? dbUser : null;
};

export const hashPassword = async (password: string) => {
	return await hash(password);
};
