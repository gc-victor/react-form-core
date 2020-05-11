import React, { useContext } from 'react';
import { FormContext } from '../../dist/react-form-core.cjs.development';

export const Validator = ({ children, validation, name, ...rest }) => {
    const { errors, setError, setSuccess, successes, values } = useContext(FormContext);
    const element = children;
    const onChange = (ev) => {
        validation({
            errors,
            setError: (error) => setError(name, error),
            setSuccess: (success) => setSuccess(name, success),
            successes,
            value: ev.target.value,
            values,
        });
    };

    return React.cloneElement(element, {
        ...rest,
        onChange,
    });
};
