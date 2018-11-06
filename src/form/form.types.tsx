import { FormEvent, FormHTMLAttributes, ReactNode } from 'react';

export const initialState = {
    value: {
        errors: {},
        values: {},
        setError: (name: string, error: any) => {},
        setValue: (name: string, value: any) => {}
    }
};
export interface Values {
    [key: string]: string;
}
export interface Errors {
    [key: string]: string;
}
export type HandleSubmit = (
    { ev, errors, values }: { ev: FormEvent<HTMLFormElement>; errors: Errors; values: Values }
) => void;
export type State = Readonly<typeof initialState>;
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    handleSubmit?: HandleSubmit;
    wait?: number;
}
export type SetValue = (name: string, value: string) => void;
export type SetError = (name: string, error: string) => void;

export interface FormChildrenProps {
    errors: Errors;
    values: Values;
    setValue: SetValue;
    setError: SetError;
}

export interface FormChildren {
    children: (context: FormChildrenProps) => ReactNode;
    [key: string]: any;
}
