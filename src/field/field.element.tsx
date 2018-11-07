import * as React from 'react';
import { FieldProps, FieldPropsChildren } from './field.types';
import { FormConsumer } from '../form';

class FieldChildrenWrapper extends React.Component<FieldPropsChildren> {
    public element: any;

    constructor(props: FieldPropsChildren) {
        super(props);

        const { children, name, setValue, values, ...rest } = props;

        if (!name) { throw Error(`Error: Please, you have to add a name to the form field`); }

        this.element = React.cloneElement(children as React.ReactElement<any>, {
            ...rest,
            name,
            onChange: this.onFieldChange,
        });
    }

    public componentDidMount() {
        const { name, setValue } = this.props;
        const props = this.element.props;
        const checkedValue = props.defaultChecked ? props.value : '';
        const value = props.defaultValue || checkedValue;

        value && setValue(name, value);
    }

    public onFieldChange = (ev: React.ChangeEvent<any>) => {
        const { name, onChange, setValue } = this.props;
        const target = ev.target;
        const value =
            target.type === 'select-multiple'
                ? Array.from(target.selectedOptions).map((option: any) => option.value)
                : target.value;
        const isCheckboxRadioElement = /checkbox|radio/.test(target.type);
        const checkedValue = target.checked === true ? value : '';

        setValue(name, isCheckboxRadioElement ? checkedValue : value);
        onChange && onChange(ev as any);
    }

    public render() {
        return (
            <React.Fragment>
                {this.element}
            </React.Fragment>
        );
    }
}

export const Field: React.SFC<FieldProps> = ({ children, name, onChange, ...rest }) =>
    <FormConsumer>
        {({ setValue, values }) =>
            <FieldChildrenWrapper
                children={children}
                name={name}
                onChange={onChange}
                setValue={setValue}
                values={values}
                {...rest}
            />}
    </FormConsumer>;
