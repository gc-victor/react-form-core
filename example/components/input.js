import React from 'react';
import { Field } from './field';

export const Input = ({ label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <input {...rest} />
        </Field>
    );
};
