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

        if (!this.validatePassword(password)) {
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

            const validPassword = await verify(existingUser.passwordHash, password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });

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

    static async register(username: string, password: string): Promise<AuthResult<string>> {
        // Validation du nom d'utilisateur
        if (!this.validateUsername(username)) {
            return {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
                }
            };
        }

        if (!this.validatePassword(password)) {
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

    private static validatePassword(password: unknown): password is string {
        return typeof password === 'string' && password.length >= 6 && password.length <= 255;
    }
}