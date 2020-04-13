import * as React from 'react';
import { act, create } from 'react-test-renderer';
import * as utils from '../src/utils';
import { Field, Form, FormContext, Validation, Validator, withValidation } from '../src';

// @see: https://github.com/facebook/jest/issues/3465#issuecomment-398738112
jest.spyOn(utils, 'debounce').mockImplementation((fn) => fn);

function submit(el: any) {
    el.props.onSubmit({ preventDefault: () => {}, persist: () => {} });
}

function reset(el: any) {
    el.props.onReset({ preventDefault: () => {}, persist: () => {} });
}

function change(el: any, value: any, type = 'text', checked = false) {
    el.props.onChange({
        persist: () => {},
        preventDefault: () => {},
        target: { checked, selectedOptions: value, type, value },
    });
}

function changeSelectMultiple(el: any, values: Array<object | undefined> = []) {
    el.props.onChange({
        persist: () => {},
        preventDefault: () => {},
        target: { type: 'select-multiple', selectedOptions: values },
    });
}

const errorMessage = (value: string) => `Error: ${value} isn't correct`;
const validation = ({ value, setError }: Validation) =>
    /error/i.test(value) && setError(errorMessage(value));

const Input = ({ name = '', ...rest }) => {
    return (
        <Field name={name} {...rest}>
            <input {...rest} />
        </Field>
    );
};
const Textarea = ({ name = '', ...rest }) => {
    return (
        <Field name={name} {...rest}>
            <textarea {...rest} />
        </Field>
    );
};
const Select = ({ name = '', ...rest }) => {
    return (
        <Field name={name} {...rest}>
            <select {...rest}>
                <option value={'Paco'}>Paco</option>
                <option value={'Paca'}>Paca</option>
            </select>
        </Field>
    );
};

test('should handle submitted values', () => {
    let submittedValues;
    let count = 0;

    const onSubmit = ({ values }: any) => {
        submittedValues = values;
        count = ++count;
    };
    const instance = create(
        <Form id={'form'} onSubmit={onSubmit}>
            <Input id={'firstName'} name={'firstName'} />
        </Form>
    ).root;

    const form = instance.findByType('form');
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco');
    });

    act(() => {
        submit(form);
    });

    expect(count).toBe(1);
    expect(submittedValues).toEqual({ firstName: 'Paco' });
});

test('should set the submitted value to true after in the first submit', () => {
    let submittedValue;
    let count = 0;

    const onSubmit = ({ submitted }: any) => {
        submittedValue = submitted;
        count = ++count;
    };
    const instance = create(
        <div>
            <Form id={'form'} onSubmit={onSubmit} />
        </div>
    ).root;

    const form = instance.findByType('form');

    act(() => {
        submit(form);
    });

    expect(count).toBe(1);
    expect(submittedValue).toEqual(true);
});

test('should set the resetted value to false after the reset', () => {
    let resettedValue;
    let count = 0;

    const onReset = ({ resetted }: any) => {
        resettedValue = resetted;
        count = ++count;
    };
    const instance = create(
        <div>
            <Form id={'form'} onReset={onReset} />
        </div>
    ).root;

    const form = instance.findByType('form');

    act(() => {
        reset(form);
    });

    expect(count).toBe(1);
    expect(resettedValue).toEqual(true);
});

test('should handle submitted successes', () => {
    let submittedSuccesses: any;
    let count = 0;

    const onSubmit = ({ successes }: any) => {
        submittedSuccesses = successes;
        count = ++count;
    };
    const validation = ({ value, setSuccess }: Validation) => {
        return value && setSuccess(value);
    };

    const instance = create(
        <div>
            <Form id={'form'} onSubmit={onSubmit}>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
                {withValidation({
                    id: 'lastName',
                    name: 'lastName',
                    validation,
                })(Input)}
            </Form>
        </div>
    ).root;

    const form = instance.findByType('form');
    const firstName = instance.find((el) => el.type == 'input' && el.props.id == 'firstName');
    const lastName = instance.find((el) => el.type == 'input' && el.props.id == 'lastName');

    act(() => {
        change(firstName, 'Paco Success');
    });
    act(() => {
        change(lastName, 'García Success');
    });
    act(() => {
        submit(form);
    });

    expect(count).toBe(1);
    expect(submittedSuccesses).toEqual({
        firstName: 'Paco Success',
        lastName: 'García Success',
    });
});

test('should handle submitted errors', () => {
    let submittedErrors: any;
    let count = 0;

    const onSubmit = ({ errors }: any) => {
        submittedErrors = errors;
        count = ++count;
    };

    const instance = create(
        <div>
            <Form id={'form'} onSubmit={onSubmit}>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
                {withValidation({
                    id: 'lastName',
                    name: 'lastName',
                    validation,
                })(Input)}
            </Form>
        </div>
    ).root;

    const form = instance.findByType('form');
    const firstName = instance.find((el) => el.type == 'input' && el.props.id == 'firstName');
    const lastName = instance.find((el) => el.type == 'input' && el.props.id == 'lastName');

    act(() => {
        change(firstName, 'Paco Error');
    });
    act(() => {
        change(lastName, 'García Error');
    });
    act(() => {
        submit(form);
    });

    expect(count).toBe(1);
    expect(submittedErrors).toEqual({
        firstName: errorMessage('Paco Error'),
        lastName: errorMessage('García Error'),
    });
});

test('should handle reset values', () => {
    let count = 0;
    let resetted: any;
    let firstName: any;
    let lastName: any;

    const onReset = ({ values }: any) => {
        resetted = values;
        count = ++count;
    };

    const instance = create(
        <div>
            <Form id={'form'} onReset={onReset}>
                <Input value={'Paca'} name={'firstName'} />
                <Input value={'García'} name={'lastName'} />
            </Form>
        </div>
    ).root;

    const form = instance.findByType('form');
    firstName = instance.find((el) => el.type == 'input' && el.props.name == 'firstName');
    lastName = instance.find((el) => el.type == 'input' && el.props.name == 'lastName');

    act(() => {
        change(firstName, 'Paco');
    });
    act(() => {
        change(lastName, 'Pérez');
    });

    expect({
        firstName: firstName.props.value,
        lastName: lastName.props.value,
    }).toEqual({
        firstName: 'Paco',
        lastName: 'Pérez',
    });

    act(() => {
        reset(form);
    });

    expect(count).toBe(1);
    expect(resetted).toEqual({
        firstName: 'Paca',
        lastName: 'García',
    });
    expect({
        firstName: firstName.props.value,
        lastName: lastName.props.value,
    }).toEqual({
        firstName: 'Paca',
        lastName: 'García',
    });
});

test('should debounce wait N milliseconds', () => {
    let wait: any;

    jest.spyOn(utils, 'debounce').mockImplementation((fn, ms) => {
        wait = ms;

        return fn;
    });

    const instance = create(
        <div>
            <Form id={'form'} wait={8}>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco');
    });

    expect(wait).toEqual(8);
});

test('should set initial values', async () => {
    let paragraph;
    const phrase = 'Paca García - Female';

    const Component = () => {
        const { initialValues } = React.useContext(FormContext);
        const { firstName, gender, lastName } = initialValues;

        return (
            <>
                <Select id={'firstName'} value={'Paca'} name={'firstName'} />
                <Input value={'García'} name={'lastName'} />
                <Input value={'Female'} name={'gender'} checked={true} type={'radio'} />
                <Input value={'Male'} name={'gender'} type={'radio'} />
                <p>{`${firstName} ${lastName} - ${gender}`}</p>;
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            paragraph = instance.findByType('p').props.children;

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should initial values be equals to values', async () => {
    let paragraph;

    const Component = () => {
        const { initialValues, values } = React.useContext(FormContext);

        return (
            <>
                <Select id={'firstName'} value={'Paca'} name={'firstName'} />
                <Input value={'García'} name={'lastName'} />
                <Input value={'Female'} name={'gender'} type={'radio'} />
                <Input value={'Male'} name={'gender'} checked={true} type={'radio'} />
                <p>{JSON.stringify(initialValues) === JSON.stringify(values)}</p>
            </>
        );
    };

    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            paragraph = instance.findByType('p').props.children;

            return paragraph === true;
        });
    });

    expect(paragraph).toBe(true);
});

test('should consume values', () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };

    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const instance = init.root;
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco');
    });

    paragraph = instance.findByType('p').props.children.join('');

    expect(paragraph).toBe(phrase);
});

test('should consume errors', () => {
    let paragraph;
    const phrase = errorMessage('Paco Error');

    const Component = () => {
        const { errors } = React.useContext(FormContext);
        const name = 'firstName';

        return (
            <>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
                <p>{errors[name]}</p>;
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const instance = init.root;
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco Error');
    });

    paragraph = instance.findByType('p').props.children;

    expect(paragraph).toBe(phrase);
});

test('should validate success', async () => {
    let paragraph;
    const phrase = 'Paco!';

    const validation = ({ value, setSuccess }: Validation) => value && setSuccess(value);
    const Component = () => {
        const name = 'firstName';
        const { successes } = React.useContext(FormContext);

        return (
            <>
                {withValidation({
                    name,
                    validation,
                })(Input)}
                <p>{successes[name]}</p>}
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );
    const instance = init.root;
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco!');
    });

    paragraph = instance.findByType('p').props.children;

    expect(paragraph).toBe(phrase);
});

test('should execute field onchange', async () => {
    let changed = false;

    const Component = () => {
        return (
            <>
                <Validator name={'firstName'} validation={validation}>
                    <Input name={'firstName'} onChange={() => (changed = true)} />
                </Validator>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const instance = init.root;
    const input = instance.findByType('input');

    act(() => {
        change(input, 'Paco Error');
    });

    expect(changed).toEqual(true);
});

test('should change value of a input text', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const input = instance.findByType('input');

            act(() => {
                change(input, 'Paco');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a input text', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} value={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;

            act(() => {
                change(instance.findByType('input'), 'Paco');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should change value of a textarea', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Textarea id={'firstName'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const textarea = instance.findByType('textarea');

            act(() => {
                change(textarea, 'Paco');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a textarea', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Textarea id={'firstName'} value={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;

            act(() => {
                change(instance.findByType('textarea'), 'Paco');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should change value of a radio element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paco'} />
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paca'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const radios = instance.findAllByType('input');
            const paca = radios[0];

            act(() => {
                change(paca, paca.props.value, paca.props.type, true);
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a radio element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input
                    checked={true}
                    id={'firstName'}
                    name={'firstName'}
                    type={'radio'}
                    value={'Paco'}
                />
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paca'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should change value of a checkbox element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} name={'firstName'} type={'checkbox'} value={'Paco'} />
                <Input id={'firstName'} name={'firstName'} type={'checkbox'} value={'Paca'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const checkboxs = instance.findAllByType('input');
            const paca = checkboxs[0];

            act(() => {
                change(paca, paca.props.value, paca.props.type, true);
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a checkbox element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input
                    checked={true}
                    id={'firstName'}
                    name={'firstName'}
                    type={'checkbox'}
                    value={'Paco'}
                />
                <Input id={'firstName'} name={'firstName'} type={'checkbox'} value={'Paca'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should change value of a select element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select id={'firstName'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const select = instance.findByType('select');

            act(() => {
                change(select, 'Paco', 'select');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a select element', async () => {
    let paragraph;
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select id={'firstName'} value={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const select = instance.findByType('select');

            act(() => {
                change(select, 'Paco', 'select');
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should change value of a select multiple element', async () => {
    let paragraph;
    const phrase = 'My name is Paca,Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select id={'firstName'} multiple name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const select = instance.findByType('select');

            act(() => {
                changeSelectMultiple(select, [{ value: 'Paca' }, { value: 'Paco' }]);
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

test('should set default value of a select multiple element', async () => {
    let paragraph;
    const phrase = 'My name is Paca,Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select id={'firstName'} value={['Paca', 'Paco']} multiple name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    const init = create(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    await act(() => {
        return waitUntil(() => {
            const instance = init.root;
            const select = instance.findByType('select');

            act(() => {
                changeSelectMultiple(select, [{ value: 'Paca' }, { value: 'Paco' }]);
            });

            paragraph = instance.findByType('p').props.children.join('');

            return paragraph === phrase;
        });
    });

    expect(paragraph).toBe(phrase);
});

class ErrorBoundary extends React.Component {
    state = { hasError: false, e: false };

    static getDerivedStateFromError(e: any) {
        return { hasError: true, e };
    }

    render() {
        if (this.state.hasError) {
            return <p>{this.state.e.toString()}</p>;
        }

        return <p>{this.props.children}</p>;
    }
}

// TODO: review console error
test("should throw an error is a form field doesn't have name", () => {
    const instance = create(
        <ErrorBoundary>
            <Form id={'form'}>
                <Input id={'error'} />
            </Form>
        </ErrorBoundary>
    ).root;

    const p = instance.findByType('p');

    expect(p.props.children).toEqual(
        'Error: Error: Please, you have to add a name to the form field'
    );
});

// @see: https://github.com/devlato/async-wait-until/blob/master/src/waitUntil.js
function waitUntil(predicate: () => any, timeout?: number, interval?: number): Promise<void> {
    const timerInterval = interval || 10;
    const timerTimeout = timeout || 200;

    return new Promise(function promiseCallback(resolve, reject) {
        let timer: NodeJS.Timeout;
        let timeoutTimer: NodeJS.Timeout;
        let clearTimers: () => any;
        let doStep: () => any;

        clearTimers = function clearWaitTimers() {
            clearTimeout(timeoutTimer);
            clearInterval(timer);
        };

        doStep = function doTimerStep() {
            let result;

            try {
                result = predicate();

                if (result) {
                    clearTimers();
                    resolve(result);
                } else {
                    timer = setTimeout(doStep, timerInterval);
                }
            } catch (e) {
                clearTimers();
                reject(e);
            }
        };

        timer = setTimeout(doStep, timerInterval);
        timeoutTimer = setTimeout(function onTimeout() {
            clearTimers();
            reject(new Error('Timed out after waiting for ' + timerTimeout + 'ms'));
        }, timerTimeout);
    });
}
