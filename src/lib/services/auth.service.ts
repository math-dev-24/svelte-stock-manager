import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { nanoid } from "nanoid";
import type { AuthResult } from "$lib/types";

export class AuthService {

    private static readonly MIN_USERNAME_LENGTH: number = 3;
    private static readonly MAX_USERNAME_LENGTH: number = 31;

    static async login(username: string, password: string): Promise<AuthResult<typeof table.user.$inferSelect>> {
        if (!this.validateUsername(username)) {
            return {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: `Invalid username (min ${this.MIN_USERNAME_LENGTH}, max ${this.MAX_USERNAME_LENGTH} characters, alphanumeric only)`
                }
            };
        }

        if (!this.validatePasswordWithDetails(password).isValid) {
            return {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid password (min 6, max 255 characters)'
                }
            };
        }

        try {
            // Récupération de l'utilisateur
            const existingUser = await this.getUser(username);

            if (!existingUser) {
                return {
                    success: false,
                    error: {
                        code: 'AUTH_ERROR',
                        message: 'Incorrect username or password'
                    }
                };
            }

            const tmp_password = await this.hashPassword(password);
            const validPassword = await this.checkPassword(tmp_password, existingUser.passwordHash);

            if (!validPassword) {
                return {
                    success: false,
                    error: {
                        code: 'AUTH_ERROR',
                        message: 'Incorrect username or password'
                    }
                };
            }

            return {
                success: true,
                data: existingUser
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An error occurred during login'
                }
            };
        }
    }

    static async updateProfile(username: string, password: string, new_password: string): Promise<AuthResult<typeof table.user.$inferSelect>> {
        try {
            const existingUser = await this.getUser(username);
            if (!existingUser) {
                return {
                    success: false,
                    error: {
                        code: 'AUTH_ERROR',
                        message: 'Incorrect username or password'
                    }
                };
            }
            const tmp_password = await this.hashPassword(password);
            const newPasswordHash = await this.hashPassword(new_password);

            if (tmp_password == newPasswordHash) {
                return {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'New password must be different from the current password'
                    }
                };
            }

            const isValidPassword = await this.checkPassword(tmp_password, existingUser.passwordHash);

            if (!isValidPassword) {
                return {
                    success: false,
                    error: {
                        code: 'AUTH_ERROR',
                        message: 'Incorrect password'
                    }
                };
            }

            const updatedUser = await db.update(table.user).set({ passwordHash: newPasswordHash }).where(eq(table.user.username, username)).returning();

            if (!updatedUser) {
                return {
                    success: false,
                    error: {
                        code: 'SERVER_ERROR',
                        message: 'Failed to update profile'
                    }
                };
            }

            return {
                success: true,
                data: updatedUser.at(0) as typeof table.user.$inferSelect
            };
        } catch  {
            return {
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An error occurred during update profile'
                }
            };
        }
    }

    static async register(username: string, password: string): Promise<AuthResult<string>> {
        if (!this.validateUsername(username)) {
            return {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
                }
            };
        }

        if (!this.validatePasswordWithDetails(password).isValid) {
            return {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid password (min 6, max 255 characters)'
                }
            };
        }

        try {
            const existingUser = await this.getUser(username);
            if (existingUser) {
                return {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Username already taken'
                    }
                };
            }

            const userId = await this.addUser(username, password);
            if (!userId) {
                return {
                    success: false,
                    error: {
                        code: 'SERVER_ERROR',
                        message: 'Failed to create user'
                    }
                };
            }

            return {
                success: true,
                data: userId
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'An error occurred during registration'
                }
            };
        }
    }

    static async getUser(username: string): Promise<typeof table.user.$inferSelect | null> {
        try {
            const results = await db.select().from(table.user).where(eq(table.user.username, username));
            return results.at(0) || null;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    }

    static validatePasswordWithDetails(password: unknown): {
        isValid: boolean;
        errors: string[];
        strength: 'weak' | 'medium' | 'strong';
    } {
        const errors: string[] = [];

        if (typeof password !== 'string') {
            return {
                isValid: false,
                errors: ['Le mot de passe doit être une chaîne de caractères'],
                strength: 'weak'
            };
        }

        const minLength = 8;
        const maxLength = 128;

        // Vérifications de base
        if (password.length < minLength) {
            errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
        }
        if (password.length > maxLength) {
            errors.push(`Le mot de passe ne peut pas dépasser ${maxLength} caractères`);
        }

        // Critères de sécurité
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

        if (!hasUpperCase) errors.push('Le mot de passe doit contenir au moins une majuscule');
        if (!hasLowerCase) errors.push('Le mot de passe doit contenir au moins une minuscule');
        if (!hasNumbers) errors.push('Le mot de passe doit contenir au moins un chiffre');
        if (!hasSpecialChar) errors.push('Le mot de passe doit contenir au moins un caractère spécial');

        // Vérifications avancées
        if (/(123|abc|password|admin|qwerty)/i.test(password)) {
            errors.push('Le mot de passe ne doit pas contenir de motifs courants');
        }
        if (/(.)\1{3,}/.test(password)) {
            errors.push('Le mot de passe ne doit pas contenir plus de 3 caractères identiques consécutifs');
        }

        // Calcul de la force
        const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        let strength: 'weak' | 'medium' | 'strong' = 'weak';

        if (criteriaCount >= 4 && password.length >= 12) {
            strength = 'strong';
        } else if (criteriaCount >= 3 && password.length >= 8) {
            strength = 'medium';
        }

        return {
            isValid: errors.length === 0,
            errors,
            strength
        };
    }

    private static hashPassword(password: string): Promise<string> {
        return hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
    }

    private static async checkPassword(tmp_password: string, passwordHash: string): Promise<boolean> {
        return await verify(passwordHash, tmp_password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
    }

    private static async addUser(username: string, password: string): Promise<string | null> {
        const userId = nanoid();
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        try {
            await db.insert(table.user).values({ id: userId, username, passwordHash });
            return userId;
        } catch (error) {
            console.error('Add user error:', error);
            return null;
        }
    }

    private static validateUsername(username: unknown): username is string {
        return (
            typeof username === 'string' &&
            username.length >= this.MIN_USERNAME_LENGTH &&
            username.length <= this.MAX_USERNAME_LENGTH &&
            /^[a-z0-9_-]+$/.test(username)
        );
    }

}