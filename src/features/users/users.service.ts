import { HttpError } from "../../shared/middleware/errorHandler";
import { normalizeEmail } from "./users.domain";
import { IUserRepository } from "./users.repository";
import { UpdateUserInput, User } from "./users.types";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpError(404, "Usuario nao encontrado");
    }

    return user;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const normalized: UpdateUserInput = {
      ...input,
      email: input.email ? normalizeEmail(input.email) : undefined
    };

    const updated = await this.userRepository.update(id, normalized);

    if (!updated) {
      throw new HttpError(404, "Usuario nao encontrado");
    }

    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new HttpError(404, "Usuario nao encontrado");
    }
  }
}
