import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export async function login(password: string): Promise<boolean> {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { password });
        const data = response.data as { token?: string };
        if (data.token) {
            localStorage.setItem('token', data.token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};