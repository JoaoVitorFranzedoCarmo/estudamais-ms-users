export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
