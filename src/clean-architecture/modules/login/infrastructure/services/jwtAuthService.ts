import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/user';
import { AuthService, TokenPayload, TokenResult } from '../../domain/services/authService';
import { TokenVerificationError } from '../../domain/errors/authErrors';

export class JwtAuthService implements AuthService {
  private readonly jwtSecret: string;
  private readonly expiresIn: number; // in seconds

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    this.expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600'); // Default: 1 hour
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainTextPassword: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, passwordHash);
  }

  generateToken(user: User): TokenResult {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.expiresIn
    });

    return {
      token,
      expiresIn: this.expiresIn
    };
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new TokenVerificationError(`Invalid token: ${(error as Error).message}`);
    }
  }
} 