import { useState } from 'react';
import useLocalStorage  from './useLocalStorage';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
    const [password, setPassword] = useState('');

    function login(inputPassword: string): boolean {
        // Replace 'yourPassword' with the actual password you want to use for authentication
        if (inputPassword === 'yourPassword') {
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