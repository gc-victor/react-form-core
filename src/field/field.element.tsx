import * as React from 'react';
import { FormContext } from '../form';
import { FieldProps } from './fields.types';

export const Field = ({ checked, children, name, onChange, value, ...rest }: FieldProps) => {
    const { setInitialValue, setValue, values } = React.useContext(FormContext);
    const valueByName = values[name];
    const childrenProps = children.props;
    const childrenValue = childrenProps.value;
    const hasCheckedAttr = /checkbox|radio/.test(childrenProps?.type);
    const noneValue = childrenProps.multiple ? [''] : '';
    const valueAttr = hasCheckedAttr
        ? { checked: valueByName === value }
        : { value: valueByName || noneValue };

    const [onChangeEvent, setOnChangeEvent] = React.useState<any>();
    const [fieldValue, setFieldValue] = React.useState<any>(valueByName);

    if (!name) {
        throw new Error('Error: Please, you have to add a name to the form field');
    }

    React.useEffect(() => {
        let timer = 0;

        // handle elements with on change
        if (onChangeEvent && onChange) {
            onChangeEvent && onChange && onChange(onChangeEvent);
            timer = setTimeout(() => {return setValue(name, fieldValue); });
        } else if (typeof fieldValue !== 'undefined') {
            // avoid radio fields not checked
            setValue(name, fieldValue);
        }

        // handle radio fields not checked
        if (childrenProps?.type === 'radio') {
            valueByName !== value && setFieldValue(undefined);
        }

        return () => {
            timer && clearTimeout(timer as number);
        };
    }, [fieldValue, setValue]);

    // Set initial values
    React.useEffect(() => {
        const checkedValue = childrenProps.checked ? childrenValue : '';
        const initialValue = hasCheckedAttr ? checkedValue : childrenValue;

        initialValue !== '' && setInitialValue(name, initialValue);
        initialValue !== '' && setValue(name, initialValue);
    }, []);

    function handleChange(ev: React.ChangeEvent<HTMLFormElement>) {
        const target = ev.target;
        const newValue =
            target.type === 'select-multiple'
                ? Array.from(target.selectedOptions).map((option: any) => {
                    return option.value;
                })
                : target.value;
        const checkedValue = target.checked === true ? newValue : '';

        ev.persist();

        setFieldValue(hasCheckedAttr ? checkedValue : newValue);
        setOnChangeEvent(ev);
    }

    return React.cloneElement(children, {
        ...rest,
        ...valueAttr,
        name,
        onChange: handleChange
    });
};
