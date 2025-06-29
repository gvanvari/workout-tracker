import { useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { login as apiLogin } from '../services/auth';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
    const [password, setPassword] = useState('');

    async function login(inputPassword: string): Promise<boolean> {
        const success = await apiLogin(inputPassword);
        if (success) {
            setIsAuthenticated(true);
            return true;
        } else {
            return false;
        }
    }

    function logout() {
        setIsAuthenticated(false);
        setPassword('');
    }

    return {
        isAuthenticated,
        login,
        logout,
        password,
        setPassword,
    };
}

export default useAuth;