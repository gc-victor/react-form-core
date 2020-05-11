import React, { useContext } from 'react';
import { FormContext } from '../../dist/react-form-core.cjs.development';
import { Validator } from './validator';

export const Field = ({ children, label, name, validation }) => {
    const { errors } = useContext(FormContext);
    const errorMessage = errors && errors[name];
    const errorClassName = errorMessage ? 'has-error' : '';

    return (
        <label className={errorClassName}>
            <span>{label}</span>
            {validation ? (
                <Validator name={name} validation={validation}>
                    {children}
                </Validator>
            ) : (
                children
            )}
            {errorMessage && <span>{errorMessage}</span>}
        </label>
    );
};
