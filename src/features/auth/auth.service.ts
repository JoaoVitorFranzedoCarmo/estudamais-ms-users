import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { HttpError } from "../../shared/middleware/errorHandler";
import { normalizeEmail } from "../users/users.domain";
import { IUserRepository } from "../users/users.repository";
import { User } from "../users/users.types";
import { AuthResult, LoginInput, RegisterInput } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];
const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = normalizeEmail(input.email);
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new HttpError(409, "Email ja cadastrado");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const created = await this.userRepository.create({ name: input.name, email, passwordHash });

    return { user: this.toPublicUser(created), token: this.generateToken(created.id) };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = normalizeEmail(input.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpError(401, "Credenciais invalidas");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, "Credenciais invalidas");
    }

    return { user: this.toPublicUser(user), token: this.generateToken(user.id) };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private toPublicUser(user: User): User {
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
}
