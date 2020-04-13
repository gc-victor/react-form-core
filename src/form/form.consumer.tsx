import * as React from 'react';
import { FormContext } from './form.context';
import { FormChildren } from './form.types';

export const FormConsumer = ({ children }: FormChildren) => {
    return <FormContext.Consumer>{children}</FormContext.Consumer>;
};
