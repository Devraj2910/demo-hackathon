import { User } from "../entities/user";

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface TokenResult {
  token: string;
  expiresIn: number;
}

export interface AuthService {
  /**
   * Hash a plain text password
   */
  hashPassword(password: string): Promise<string>;
  
  /**
   * Verify if a plain text password matches a hash
   */
  comparePasswords(plainTextPassword: string, passwordHash: string): Promise<boolean>;
  
  /**
   * Generate JWT token for the user
   */
  generateToken(user: User): TokenResult;
  
  /**
   * Verify a token and return the payload if valid
   */
  verifyToken(token: string): TokenPayload | null;
} 