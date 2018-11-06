import { ReactNode } from 'react';

export const initialState = {};
export type State = Readonly<typeof initialState>;
export interface ErrorMessageProps {
    children: ReactNode;
    name: string;
    validator: (value: string) => string | Promise<string>;
    [key: string]: any;
}
export interface ErrorMessageElementProps extends ErrorMessageProps, State {}
