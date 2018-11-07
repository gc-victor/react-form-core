import * as React from 'react';
import { FormProps, State } from './form.types';
import { FormContext } from './form.context';
import { debounce, omit } from '../utils';

export class Form extends React.Component<FormProps, State> {
    constructor(props: FormProps) {
        super(props);

        this.setError = debounce(this.setError, props.wait === undefined ? 750 : props.wait);
        this.state = {
            value: {
                errors: {},
                setError: this.setError,
                setValue: this.setValue,
                values: {}
            }
        };
    }

    public deleteError = (name: string) => {
        const stateValue = this.state.value;
        const { errors } = stateValue;
        const newErrors = omit(errors, [name]);

        this.setState({
            value: {
                ...stateValue,
                errors: newErrors
            }
        });
    }

    public setValue = (name: string, value: any) => {
        const stateValue = this.state.value;
        const { values } = stateValue;

        this.deleteError(name);
        this.setState({
            value: {
                ...stateValue,
                values: {
                    ...values,
                    [name]: value
                }
            }
        });
    }

    public setError = (name: string, error: any): void => {
        const stateValue = this.state.value;
        const { errors } = stateValue;

        this.setState({
            value: {
                ...stateValue,
                errors: {
                    ...errors,
                    [name]: error,
                }
            }
        });
    }

    public onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        const { handleSubmit } = this.props;
        const stateValue = this.state.value;
        const { errors, values } = stateValue;

        ev.preventDefault();
        handleSubmit && handleSubmit({ ev, errors, values });
    }

    public render() {
        const { children, ...rest } = this.props;

        return (
            <FormContext.Provider value={this.state.value}>
                <form {...rest} onSubmit={this.onSubmit}>
                    {children}
                </form>
            </FormContext.Provider>
        );
    }
}