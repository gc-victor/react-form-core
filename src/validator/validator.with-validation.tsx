import * as React from 'react';
import { Validator } from './validator.element';

export const withValidation = ({ name, validation, ...rest }: any) => {
    return (FormField: React.ComponentType<any>) => {
        return (
            <Validator name={name} validation={validation}>
                <FormField name={name} {...rest} />
            </Validator>
        );
    };
};
