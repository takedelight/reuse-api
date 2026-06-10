import { type OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { type User } from './user.model';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;

  createUser(user: Partial<User>): Promise<User>;
  updateUser(userId: string, user: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;

  upsertOAuthUser(profile: OAuthProfileDto): Promise<User>;
}
