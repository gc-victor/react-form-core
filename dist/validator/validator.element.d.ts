import * as React from 'react';
import { ValidatorProps } from './validator.types';
export declare const Validator: ({ children, validation, name, ...rest }: ValidatorProps) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
