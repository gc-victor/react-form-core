import React from 'react';
import { Field } from './field';

export const Radio = ({ label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <input {...rest} type="radio" />
        </Field>
    );
};
