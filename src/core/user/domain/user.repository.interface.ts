import { type OAuthProfileDto } from 'src/core/auth/dto/oauth-response.dto';
import { type UserModel } from './user.model';

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');

export interface IUserRepository {
  getAllUsers(): Promise<UserModel[]>;
  getUserById(userId: string): Promise<UserModel | null>;
  getUserByEmail(email: string): Promise<UserModel | null>;

  createUser(user: Partial<UserModel>): Promise<UserModel>;
  updateUser(userId: string, user: Partial<UserModel>): Promise<UserModel>;
  deleteUser(userId: string): Promise<void>;

  upsertOAuthUser(profile: OAuthProfileDto): Promise<UserModel>;
}
