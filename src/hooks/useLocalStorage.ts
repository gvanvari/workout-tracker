import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
    function getStoredValue(): T {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    }

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    function setValue(value: T | ((val: T) => T)) {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        function handleStorageChange() {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.error(error);
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue] as const;
}

export default useLocalStorage;