import * as React from 'react';
import { FormConsumer } from '../form';
import { ErrorMessageProps } from './error-message.types';

export const ErrorMessage: React.SFC<ErrorMessageProps> = ({
    children,
    validator,
    name,
    ...rest
}) =>
    <FormConsumer>
        {({ setError }) => {
            const setErrorMessage = (ev: React.ChangeEvent<HTMLFormElement>) => {
                const target = ev.target;
                const message = validator(target.value);

                ev.preventDefault();

                message && typeof message === 'string' && setError(name, message);
                message &&
                    typeof message !== 'string' &&
                    message.then((value: string) => {
                        setError(name, value);
                    });
            };

            return React.cloneElement(children as React.ReactElement<any>, {
                ...rest,
                onChange: setErrorMessage,
            });
        }}
    </FormConsumer>;
