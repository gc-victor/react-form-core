import React from 'react';
import { Field } from './field';

export const Textarea = ({ label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <textarea {...rest} />
        </Field>
    );
};
