import { FormEvent, FormHTMLAttributes, ReactNode } from 'react';
export declare const initialState: {
    value: {
        errors: {};
        ev: any;
        initialValues: {};
        resetted: boolean;
        setError: (_name: string, _error: any) => void;
        setInitialValue: (_name: string, _value: any) => void;
        setSuccess: (_name: string, _success: any) => void;
        setValue: (_name: string, _value: any) => void;
        submitted: boolean;
        successes: {};
        values: {};
    };
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
export declare type OnSubmit = (formChildrenProps: FormChildrenProps) => void;
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    OnSubmit?: OnSubmit;
    wait?: number;
}
export declare type SetInitialValue = (name: string, value: string) => void;
export declare type SetValue = (name: string, value: string) => void;
export declare type SetError = (name: string, error: string | string[] | Promise<any>) => void;
export declare type SetSuccess = (name: string, successes: string | string[] | Promise<any>) => void;
export interface FormChildrenProps {
    errors: Errors;
    ev: FormEvent<HTMLFormElement>;
    initialValues: Values;
    resetted: boolean;
    setError: SetError;
    setInitialValue: SetInitialValue;
    setSuccess: SetSuccess;
    setValue: SetValue;
    submitted: boolean;
    successes: Successes;
    values: Values;
}
export interface FormChildren {
    children: (formContext: FormChildrenProps) => ReactNode;
    [key: string]: any;
}
