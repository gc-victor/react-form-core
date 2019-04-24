import { FormEvent, FormHTMLAttributes, ReactNode } from 'react';

export const initialState = {
    value: {
        errors: {},
        initialValues: {},
        setError: (name: string, error: any) => {},
        setInitialValue: (name: string, value: any) => {},
        setSuccess: (name: string, success: any) => {},
        setValue: (name: string, value: any) => {},
        submitted: false,
        successes: {},
        values: {},
    },
};
export interface Values {
    [key: string]: string;
}
export interface Errors {
    [key: string]: string;
}
export interface Successes {
    [key: string]: string;
}
export type OnSubmit = (
    {
        ev,
        errors,
        initialValues,
        setError,
        setInitialValue,
        setSuccess,
        setValue,
        submitted,
        successes,
        values,
    }: {
        ev: FormEvent<HTMLFormElement>;
        errors: Errors;
        initialValues: Values;
        setError: SetError;
        setInitialValue: SetInitialValue;
        setSuccess: SetSuccess;
        setValue: SetValue;
        submitted: boolean;
        successes: Successes;
        values: Values;
    }
) => void;
export type State = Readonly<typeof initialState>;
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    wait?: number;
}
export type SetInitialValue = (name: string, value: string) => void;
export type SetValue = (name: string, value: string) => void;
export type SetError = (name: string, error: string | string[] | Promise<any>) => void;
export type SetSuccess = (name: string, successes: string | string[] | Promise<any>) => void;
export interface FormChildrenProps {
    errors: Errors;
    initialValues: Values;
    setError: SetError;
    setInitialValue: SetInitialValue;
    setSuccess: SetSuccess;
    setValue: SetValue;
    submitted: boolean;
    successes: Successes;
    values: Values;
}
export interface FormChildren {
    children: (formContext: any) => ReactNode;
    [key: string]: any;
}
