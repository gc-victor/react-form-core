import * as React from 'react';
import { ErrorMessage } from './error-message.element';

export const withErrorMessage = ({ name, validator, ...rest }: any) => (
    FormField: React.ComponentType<any>
) =>
    <ErrorMessage name={name} validator={validator}>
        <FormField name={name} {...rest} />
    </ErrorMessage>;
