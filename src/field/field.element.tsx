import * as React from 'react';
import { FieldProps, FieldPropsChildren } from './fields.types';
import { FormConsumer, SetInitialValue, SetValue, Values } from '../form';

class FieldChildrenWrapper extends React.Component<FieldPropsChildren> {
    public element: any;
    public hasCheckedAttr: boolean;

    constructor(props: FieldPropsChildren) {
        super(props);

        this.hasCheckedAttr = /checkbox|radio/.test(props.children.props.type);

        if (!props.name) {
            throw Error('Error: Please, you have to add a name to the form field');
        }
    }

    public componentDidMount() {
        const { name, setInitialValue, setValue } = this.props;
        const children = this.props.children as React.ReactElement<any>;
        const childrenProps = children ? children.props : {};
        const checkedValue = childrenProps.checked ? childrenProps.value : '';
        const value = this.hasCheckedAttr ? checkedValue : childrenProps.value;

        value !== '' && setInitialValue(name, value);
        value !== '' && setValue(name, value);
    }

    public changed = (ev: React.ChangeEvent<any>) => {
        const { name, onChange, setValue } = this.props;
        const target = ev.target;
        const value =
            target.type === 'select-multiple'
                ? Array.from(target.selectedOptions).map((option: any) => option.value)
                : target.value;
        const checkedValue = target.checked === true ? value : '';

        setValue(name, this.hasCheckedAttr ? checkedValue : value);
        onChange && onChange(ev as any);
    }

    public render() {
        const {
            checked,
            children,
            name,
            setInitialValue,
            setValue,
            values = {},
            ...rest
        } = this.props;
        const element = children as React.ReactElement<any>;
        const value = values[name];
        const noneValue = element.props.multiple ? [''] : '';
        const valueAttr = this.hasCheckedAttr
            ? { checked: value === this.props.value }
            : { value: value || noneValue };

        if (checked && setInitialValue && setValue && values) {
        }

        return React.cloneElement(element, {
            ...rest,
            ...valueAttr,
            name,
            onChange: this.changed,
        });
    }
}

export const Field = ({ children, name, onChange, ...rest }: FieldProps) => (
    <FormConsumer>
        {({
            setInitialValue,
            setValue,
            values,
        }: {
            setInitialValue: SetInitialValue;
            setValue: SetValue;
            values: Values;
        }) => (
            <FieldChildrenWrapper
                children={children}
                name={name}
                onChange={onChange}
                setInitialValue={setInitialValue}
                setValue={setValue}
                values={values}
                {...rest}
            />
        )}
    </FormConsumer>
);
