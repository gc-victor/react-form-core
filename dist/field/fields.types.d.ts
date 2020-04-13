export interface FieldProps {
    name: string;
    validator?: (value: string) => string;
    [key: string]: any;
}
