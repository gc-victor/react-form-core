import * as React from 'react';
import { FormChildrenProps, FormConsumer } from '../form';
import { ValidatorProps } from './validator.types';

export const Validator = ({ children, validation, name, ...rest }: ValidatorProps) =>
    <FormConsumer>
        {({ errors, setError, setSuccess, successes, values }: FormChildrenProps) => {
            const getMessage = (onChange?: (ev: React.ChangeEvent<HTMLFormElement>) => any) => (
                ev: React.ChangeEvent<HTMLFormElement>
            ) => {
                ev.preventDefault();

                validation({
                    errors,
                    setError: error => setError(name, error),
                    setSuccess: success => setSuccess(name, success),
                    successes,
                    value: ev.target.value,
                    values,
                });

                onChange && onChange(ev);
            };
            const element = children as React.ReactElement<any>;

            return React.cloneElement(element, {
                ...rest,
                onChange: getMessage(element && element.props && element.props.onChange),
            });
        }}
    </FormConsumer>;
