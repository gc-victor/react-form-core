import * as React from 'react';
import { FormContext } from '../form';
import { ValidatorProps } from './validator.types';

export const Validator = ({ children, validation, name, ...rest }: ValidatorProps) => {
    const { errors, setError, setSuccess, successes, values } = React.useContext(FormContext);

    const getMessage = (onChange?: (ev: React.ChangeEvent<HTMLFormElement>) => any) => {
        return (ev: React.ChangeEvent<HTMLFormElement>) => {
            ev.preventDefault();

            validation({
                errors,
                setError: (error) => {return setError(name, error); },
                setSuccess: (success) => {return setSuccess(name, success); },
                successes,
                value: ev.target.value,
                values
            });

            onChange && onChange(ev);
        };
    };
    const element = children as React.ReactElement;

    return React.cloneElement(element, {
        ...rest,
        onChange: getMessage(element?.props?.onChange)
    });
};
