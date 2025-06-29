import { useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { login as apiLogin } from '../services/auth';

function useAuth() {
    // Always coerce to boolean in case localStorage has a string or null
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
    const [password, setPassword] = useState('');

    async function login(inputPassword: string): Promise<boolean> {
        const success = await apiLogin(inputPassword);
        if (success) {
            setIsAuthenticated(true);
            return true;
        } else {
            setIsAuthenticated(false); // Explicitly set to false on failed login
            return false;
        }
    }

    function logout() {
        setIsAuthenticated(false);
        setPassword('');
    }

    return {
        isAuthenticated: Boolean(isAuthenticated), // Always return a boolean
        login,
        logout,
        password,
        setPassword,
    };
}

export default useAuth;