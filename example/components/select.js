import React from 'react';
import { Field } from './field';

export const Select = ({ children, label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <select {...rest}>
                {children}
            </select>
        </Field>
    );
};
