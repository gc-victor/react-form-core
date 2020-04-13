import * as React from 'react';
import { FormChildrenProps, initialState } from './form.types';

export const FormContext = React.createContext<FormChildrenProps>(initialState.value);
