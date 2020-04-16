import { FormEvent, FormHTMLAttributes, ReactNode } from 'react';

export const initialState = {
    errors: {},
    ev: false as any,
    initialValues: {},
    resetted: false,
    setError: (_name: string, _error: any) => {},
    setSuccess: (_name: string, _success: any) => {},
    setValue: (_name: string, _value: any) => {},
    submitted: false,
    successes: {},
    values: {}
};
export interface Values {
    [key: string]: string
}
export interface Errors {
    [key: string]: string
}
export interface Successes {
    [key: string]: string
}
export type OnSubmit = (formChildrenProps: FormChildrenProps) => void;
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    OnSubmit?: OnSubmit
}
export type SetValue = (name: string, value: string) => void;
export type SetError = (name: string, error: string | string[] | Promise<any>) => void;
export type SetSuccess = (name: string, successes: string | string[] | Promise<any>) => void;
export interface FormChildrenProps {
    errors: Errors
    ev: FormEvent<HTMLFormElement>
    initialValues: Values
    resetted: boolean
    setError: SetError
    setSuccess: SetSuccess
    setValue: SetValue
    submitted: boolean
    successes: Successes
    values: Values
}
export interface FormChildren {
    children: (formContext: FormChildrenProps) => ReactNode
    [key: string]: any
}
