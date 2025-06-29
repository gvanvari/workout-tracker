export interface AuthData {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}