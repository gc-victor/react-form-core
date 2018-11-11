import { SetValue, Values } from '../form';

export interface FieldProps {
    name: string;
    validator?: (value: string) => string;
    [key: string]: any;
}

export interface FieldPropsChildren extends FieldProps {
    setValue: SetValue;
    values: Values;
}
