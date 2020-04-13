import { ReactNode } from 'react';
import { Errors, Successes, Values } from '../form';
export interface Validation {
    errors: Errors;
    setError: (message: any) => void;
    setSuccess: (message: any) => void;
    successes: Successes;
    value: any;
    values: Values;
}
export interface ValidatorProps {
    children: ReactNode;
    name: string;
    validation: ({ errors, setError, setSuccess, successes, value, values }: Validation) => void;
    [key: string]: any;
}
