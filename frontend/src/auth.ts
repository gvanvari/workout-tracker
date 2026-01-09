import * as API from './api';

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      return Date.now() > payload.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

export async function handleLogin(
  password: string,
  onSuccess: (token: string) => void,
  onError: (message: string) => void
) {
  try {
    const result = await API.login(password);
    const token = result.token;
    localStorage.setItem('token', token);
    onSuccess(token);
  } catch (error: any) {
    onError(error.message);
  }
}

export function handleLogout() {
  localStorage.removeItem('token');
}
