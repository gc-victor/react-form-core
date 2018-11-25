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

    public deleteError = (name: string) => () => {
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
        this.setState((state) => {
            const stateValue = state.value;
            const { values } = stateValue;

            return {
                value: {
                    ...stateValue,
                    values: {
                        ...values,
                        [name]: value
                    }
                }
            };
        }, this.deleteError(name));
    }

    public setError = (name: string, error: any): void => {
        this.setState((state) => {
            const stateValue = state.value;
            const { errors } = stateValue;

            return {
                value: {
                    ...stateValue,
                    errors: {
                        ...errors,
                        [name]: error,
                    }
                }
            };
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
        const { children, handleSubmit, ...rest } = this.props;

        // hack to avoid the compiler to remove the not used variable
        if (handleSubmit) {}

        return (
            <FormContext.Provider value={this.state.value}>
                <form {...rest} onSubmit={this.onSubmit}>
                    {children}
                </form>
            </FormContext.Provider>
        );
    }
}
