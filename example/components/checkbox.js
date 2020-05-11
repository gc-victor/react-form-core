import React from 'react';
import { Field } from './field';

export const Checkbox = ({ label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <input {...rest} type="checkbox" />
        </Field>
    );
};
