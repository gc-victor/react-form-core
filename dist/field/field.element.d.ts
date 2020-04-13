import * as React from 'react';
import { FieldProps } from './fields.types';
export declare const Field: ({ checked, children, name, onChange, value, ...rest }: FieldProps) => React.DetailedReactHTMLElement<{
    name: string;
    onChange: (ev: React.ChangeEvent<HTMLFormElement>) => void;
    checked: boolean;
    value?: undefined;
    validator?: ((value: string) => string) | undefined;
} | {
    name: string;
    onChange: (ev: React.ChangeEvent<HTMLFormElement>) => void;
    value: string | string[];
    checked?: undefined;
    validator?: ((value: string) => string) | undefined;
}, HTMLElement>;
