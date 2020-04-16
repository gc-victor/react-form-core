import * as React from 'react';
import { FormContext } from '../form';
import { ValidatorProps } from './validator.types';

export const Validator = ({ children, validation, name, ...rest }: ValidatorProps) => {
    const { errors, setError, setSuccess, successes, values } = React.useContext(FormContext);
    const element = children as any;
    const onChange = (ev: React.ChangeEvent<HTMLFormElement>) => {
        validation({
            errors,
            setError: (error) => {return setError(name, error); },
            setSuccess: (success) => {return setSuccess(name, success); },
            successes,
            value: ev.target.value,
            values
        });
    };

    return React.cloneElement(element, {
        ...rest,
        onChange
    });
};
