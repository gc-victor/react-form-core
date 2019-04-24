import { createContext } from 'react';
import { FormChildrenProps, initialState } from './form.types';

export const FormContext = createContext<FormChildrenProps>(initialState.value);
