import { createContext } from 'react';

export const FormContext = createContext({
    errors: {},
    setError: (name: string, error: string) => {},
    setValue: (name: string, value: string) => {},
    values: {}
});
