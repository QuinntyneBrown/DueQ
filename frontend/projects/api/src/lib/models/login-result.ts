import { User } from './user';

export interface LoginResult {
  readonly token: string;
  readonly user: User;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}
