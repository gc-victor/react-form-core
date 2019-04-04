import * as React from 'react';
import { FormProps, State } from './form.types';
import { FormContext } from './form.context';
import { debounce, omit } from '../utils';

export class Form extends React.Component<FormProps, State> {
    constructor(props: FormProps) {
        super(props);

        this.setError = debounce(this.setError, props.wait === undefined ? 750 : props.wait);
        this.setSuccess = debounce(this.setSuccess, props.wait === undefined ? 750 : props.wait);
        this.state = {
            value: {
                errors: {},
                initialValues: {},
                setError: this.setError,
                setInitialValue: this.setInitialValue,
                setSuccess: this.setSuccess,
                setValue: this.setValue,
                submitted: false,
                successes: {},
                values: {},
            },
        };
    }

    public setInitialValue = (name: string, value: any) => {
        this.setState(state => {
            const stateValue = state.value;
            const { initialValues, values } = stateValue;

            return {
                value: {
                    ...stateValue,
                    initialValues: {
                        ...initialValues,
                        [name]: value,
                    },
                    values: {
                        ...values,
                        [name]: value,
                    },
                },
            };
        });
    }

    public setValue = (name: string, value: any) => {
        this.setState(state => {
            const stateValue = state.value;
            const { errors, successes, values } = stateValue;
            const newErrors = omit(errors, [name]);
            const newSuccesses = omit(successes, [name]);

            return {
                value: {
                    ...stateValue,
                    errors: newErrors,
                    submitted: false,
                    successes: newSuccesses,
                    values: {
                        ...values,
                        [name]: value,
                    },
                },
            };
        });
    }

    public setError = (name: string, error: any): void => {
        this.setState(state => {
            const stateValue = state.value;
            const { errors } = stateValue;

            return {
                value: {
                    ...stateValue,
                    errors: {
                        ...errors,
                        [name]: error,
                    },
                },
            };
        });
    }

    public setSuccess = (name: string, success: any): void => {
        this.setState(state => {
            const stateValue = state.value;
            const { successes } = stateValue;

            return {
                value: {
                    ...stateValue,
                    successes: {
                        ...successes,
                        [name]: success,
                    },
                },
            };
        });
    }

    public onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        const { onSubmit } = this.props;

        ev.preventDefault();

        this.setState(state => {
            onSubmit && onSubmit({ ev, ...state.value } as any);

            return {
                value: {
                    ...state.value,
                    submitted: true,
                }
            };
        });
    }

    public onReset = (ev: React.FormEvent<HTMLFormElement>) => {
        const { onReset } = this.props;

        ev.preventDefault();

        this.setState(state => {
            const stateValue = state.value;

            return {
                value: {
                    ...stateValue,
                    errors: {},
                    submitted: false,
                    successes: {},
                    values: stateValue.initialValues,
                }
            };
        }, () => onReset && onReset({ ev, ...this.state.value } as any));
    }

    public render() {
        const { children, ...rest } = this.props;

        return (
            <FormContext.Provider value={this.state.value}>
                <form {...rest} onSubmit={this.onSubmit} onReset={this.onReset}>
                    {children}
                </form>
            </FormContext.Provider>
        );
    }
}
