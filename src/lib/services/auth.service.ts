import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { nanoid } from "nanoid";
import type { AuthResult } from "$lib/types";
import type { User } from "$lib/server/db/schema";

export class AuthService {

    private static readonly MIN_USERNAME_LENGTH: number = 3;
    private static readonly MAX_USERNAME_LENGTH: number = 31;

    static async login(username: string, password: string): Promise<AuthResult<User>> {
        if (!this.validateUsername(username)) {
            await this.failedLogin();
            return {
                success: false,
                error: `Invalid username (min ${this.MIN_USERNAME_LENGTH}, max ${this.MAX_USERNAME_LENGTH} characters, alphanumeric only)`
            };
        }

        if (!this.validatePasswordWithDetails(password).isValid) {
            await this.failedLogin();
            return {
                success: false,
                error: 'Invalid password (min 6, max 255 characters)'
            };
        }

        try {

            const existingUser = await this.getUser(username);

            if (!existingUser) {
                await this.failedLogin();
                return {
                    success: false,
                    error: 'Invalid username or password'
                };
            }

            const validPassword = await this.checkPassword(password, existingUser.passwordHash);

            if (!validPassword) {
                await this.failedLogin();
                return {
                    success: false,
                    error: 'Invalid username or password'
                };
            }

            return {
                success: true,
                data: existingUser
            };
        } catch (error) {
            console.error('Login error:', error);
            await this.failedLogin();
            return {
                success: false,
                error: 'An error occurred during login'
            };
        }
    }

    static async updateProfile(username: string, password: string, new_password: string): Promise<AuthResult<User>> {
        try {
            const existingUser = await this.getUser(username);
            if (!existingUser) {
                return {
                    success: false,
                    error: 'Incorrect username or password'
                };
            }

            // check password actuel OK
            const isValidPassword = await this.checkPassword(password, existingUser.passwordHash);


            if (!isValidPassword) {
                return {
                    success: false,
                    error: 'New password must be different from the current password'
                };
            }

            const isSamePassword = await this.checkPassword(new_password, existingUser.passwordHash);

            if (!isSamePassword) {
                return {
                    success: false,
                    error: 'Incorrect password'
                };
            }

            const newPasswordHash = await this.hashPassword(new_password);

            const updatedUser = await db.update(table.user).set({ passwordHash: newPasswordHash }).where(eq(table.user.username, username)).returning();

            if (!updatedUser) {
                return {
                    success: false,
                    error: 'Failed to update profile'
                };
            }

            return {
                success: true,
                data: updatedUser.at(0) as User
            };
        } catch  {
            return {
                success: false,
                error: 'An error occurred during update profile'
            };
        }
    }

    static async register(username: string, password: string): Promise<AuthResult<string>> {
        if (!this.validateUsername(username)) {
            return {
                success: false,
                error: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
            };
        }

        if (!this.validatePasswordWithDetails(password).isValid) {
            return {
                success: false,
                error: 'Invalid password (min 6, max 255 characters)'
            };
        }

        try {
            const existingUser = await this.getUser(username);
            if (existingUser) {
                return {
                    success: false,
                    error: 'Username already taken'
                };
            }

            const userId = await this.addUser(username, password);
            if (!userId) {
                return {
                    success: false,
                    error: 'Failed to create user'
                };
            }

            return {
                success: true,
                data: userId
            };
        } catch {
            return {
                success: false,
                error: 'An error occurred during registration'
            };
        }
    }

    static async getUser(username: string): Promise<User | null> {
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
        return hash(password, this.getConfigPassword());
    }

    private static async checkPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
        return await verify(passwordHash, plainPassword);
    }

    private static async addUser(username: string, password: string): Promise<string | null> {
        const userId = nanoid();
        const passwordHash = await hash(password, this.getConfigPassword());

        try {
            await db.insert(table.user).values({ id: userId, username, passwordHash: passwordHash });
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

    private static getConfigPassword(): object {
        return {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        }
    }

    private static async failedLogin() : Promise<void> {
        setTimeout(() => {
            return;
        }, 2000);
    }
}