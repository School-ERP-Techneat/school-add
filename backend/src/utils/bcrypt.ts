import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password.
 * @param password - Raw user password.
 * @returns A promise resolving to a hashed password string.
 */

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a plain-text password against a hashed password.
 * @param plainPassword - Raw password from user input.
 * @param hashedPassword - Password stored in the database.
 * @returns A promise resolving to true if the passwords match.
 */

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
