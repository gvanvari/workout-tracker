import React from 'react';

interface InputProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

function Input({ label, type = 'text', value, onChange, placeholder, required }: InputProps) {
    return (
        <div className="input-container">
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input-field"
            />
        </div>
    );
}

export default Input;