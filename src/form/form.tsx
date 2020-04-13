import * as React from 'react';
import { FormProps } from './form.types';
import { FormContext } from './form.context';
import { debounce, omit } from '../utils';

export const Form = ({ children, onReset, onSubmit, wait, ...rest }: FormProps) => {
    const [state, setState] = React.useState({
        errors: {},
        ev: false as any,
        initialValues: {},
        resetted: false,
        submitted: false,
        successes: {},
        values: {},
        setError: debounce(handleError, !wait ? 750 : wait),
        setInitialValue: handleInitialValue,
        setSuccess: debounce(handleSuccess, !wait ? 750 : wait),
        setValue: handleValue
    });

    React.useEffect(() => {
        const submitted = state.submitted;

        if (submitted && onSubmit) {
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
        const resetted = state.resetted;
        const formEvent = state.ev;

        if (formEvent && resetted && onReset) {
            onReset({ ev: formEvent, ...state } as any);

            setState((prevState) => {
                return {
                    ...prevState,
                    resetted: false
                };
            });
        }
    }, [onReset, state]);

    function handleInitialValue(name: string, initialValue: any) {
        setState((prevState) => {
            return {
                ...prevState,
                initialValues: {
                    ...prevState.initialValues,
                    [name]: initialValue
                },
                values: {
                    ...prevState.values,
                    [name]: initialValue
                }
            };
        });
    }

    function handleValue(name: string, newValue: any) {
        setState((prevState) => {
            return {
                ...prevState,
                errors: omit(prevState.errors, [name]),
                submitted: false,
                successes: omit(state.successes, [name]),
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

    function handleReset(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        ev.persist();

        setState((prevState) => {
            return {
                ...prevState,
                errors: {},
                ev,
                resetted: true,
                successes: {},
                values: prevState.initialValues
            };
        });
    }

    return (
        <FormContext.Provider value={state}>
            <form {...rest} onSubmit={handleSubmit} onReset={handleReset}>
                {children}
            </form>
        </FormContext.Provider>
    );
};
