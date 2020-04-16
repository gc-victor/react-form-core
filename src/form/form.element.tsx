import * as React from 'react';
import { FormProps } from './form.types';
import { FormContext } from './form.context';
import { omit } from '../utils';

interface Model {
    [key: string]: any
}

export const Form = ({ children, onReset, onSubmit, ...rest }: FormProps) => {
    const formRef = React.useRef(null);
    const [state, setState] = React.useState({
        errors: {},
        ev: false as any,
        initialValues: {},
        resetted: false,
        submitted: false,
        successes: {},
        values: {},
        setError: handleError,
        setSuccess: handleSuccess,
        setValue: handleValue
    });

    React.useEffect(() => {
        const form = (formRef.current as unknown) as HTMLFormElement;
        const initialValues = Array.from(form.elements).reduce((acc: Model, element: any) => {
            const type = element.type;
            const hasCheckedAttr = /checkbox|radio/.test(element.type);
            const isChecked = element.defaultChecked === true;
            const value =
                element.type === 'select-multiple'
                    ? Array.from(element.selectedOptions).map((option: any) => {
                        return option.value;
                    })
                    : element.value || element.defaultValue;
            const checkedValue = isChecked ? value : '';

            if (type === 'radio') {
                return { ...acc, [element.name]: isChecked ? value : acc[element.name] };
            }

            return { ...acc, [element.name]: hasCheckedAttr ? checkedValue : value };
        }, {});

        setState((prevState) => {
            return {
                ...prevState,
                initialValues,
                values: initialValues
            };
        });
    }, []);

    React.useEffect(() => {
        if (state.submitted && onSubmit) {
            onSubmit({ ...state } as any);

            setState((prevState) => {
                return {
                    ...prevState,
                    submitted: false
                };
            });
        }
    }, [onSubmit, state]);

    React.useEffect(() => {
        if (state.resetted && onReset) {
            onReset({ ...state } as any);

            setState((prevState) => {
                return {
                    ...prevState,
                    resetted: false
                };
            });
        }
    }, [onReset, state]);

    function handleValue(name: string, newValue: any) {
        setState((prevState) => {
            return {
                ...prevState,
                errors: omit(prevState.errors, [name]),
                submitted: false,
                successes: omit(prevState.successes, [name]),
                values: {
                    ...prevState.values,
                    [name]: newValue
                }
            };
        });
    }

    function handleError(name: string, error: any) {
        setState((prevState) => {
            return {
                ...prevState,
                errors: {
                    ...prevState.errors,
                    [name]: error
                }
            };
        });
    }

    function handleSuccess(name: string, success: any) {
        setState((prevState) => {
            return {
                ...prevState,
                successes: {
                    ...prevState.successes,
                    [name]: success
                }
            };
        });
    }

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        ev.persist();

        setState((prevState) => {
            return {
                ...prevState,
                ev,
                submitted: true
            };
        });
    }

    function handleReset() {
        setState((prevState) => {
            return {
                ...prevState,
                errors: {},
                resetted: true,
                successes: {},
                values: prevState.initialValues
            };
        });
    }

    function handleChange(ev: React.ChangeEvent<HTMLFormElement>) {
        const element = ev.target;
        const hasCheckedAttr = /checkbox|radio/.test(element.type);
        const value =
            element.type === 'select-multiple'
                ? Array.from(element.selectedOptions).map((option: any) => {
                    return option.value;
                })
                : element.value;
        const checkedValue = element.checked === true ? value : '';

        handleValue(element.name, hasCheckedAttr ? checkedValue : value);
    }

    return (
        <form
            onChangeCapture={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            ref={formRef}
            {...rest}
        >
            <FormContext.Provider value={state}>{children}</FormContext.Provider>
        </form>
    );
};
