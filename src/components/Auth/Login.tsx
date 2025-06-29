import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (password) {
            const success = login(password);
            if (!success) {
                setError('Invalid password. Please try again.');
            }
        } else {
            setError('Password is required.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" label={''}                />
                {error && <p className="error">{error}</p>}
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
};

export default Login;