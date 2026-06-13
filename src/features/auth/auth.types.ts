import { User } from "../users/users.types";

export interface AuthResult {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
