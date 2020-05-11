import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormContext } from '../src/form';

const Input = ({ ...rest }: any) => {
    return <input {...rest} />;
};
const Textarea = ({ ...rest }) => {
    return <textarea {...rest} />;
};
const Select = ({ ...rest }) => {
    return (
        <select {...rest}>
            <option value={'Paco'}>Paco</option>
            <option value={'Paca'}>Paca</option>
        </select>
    );
};

test('should handle submitted values', () => {
    let submittedValues;
    let count = 0;

    const onSubmit = ({ values }: any) => {
        submittedValues = values;
        count = ++count;
    };

    render(
        <Form id={'form'} onSubmit={onSubmit}>
            <Input id={'firstName'} name={'firstName'} />
        </Form>
    );

    const form = document.getElementById('form');
    const input = document.getElementById('firstName');

    fireEvent.change(input as HTMLInputElement, {
        target: {
            value: 'Paco',
        },
    });

    fireEvent.submit(form as HTMLFormElement);

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

    render(<Form id={'form'} onSubmit={onSubmit} />);

    const form = document.getElementById('form');

    fireEvent.submit(form as HTMLFormElement);

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

    render(<Form id={'form'} onReset={onReset} />);

    const form = document.getElementById('form');

    fireEvent.reset(form as HTMLFormElement);

    expect(count).toBe(1);
    expect(resettedValue).toEqual(true);
});

test('should reset the values in the state are the initial values', () => {
    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} name={'firstName'} defaultValue="Paco" />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };

    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;
    const input = document.getElementById('firstName');

    fireEvent.change(input as HTMLInputElement, {
        target: {
            value: 'Paca',
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe('My name is Paca');

    fireEvent.reset(form as HTMLFormElement);

    expect(form.querySelector('p')?.innerHTML).toBe('My name is Paco');
});

test('should consume values', () => {
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

    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;
    const firstName = document.getElementById('firstName');

    fireEvent.change(firstName as HTMLInputElement, {
        target: {
            value: 'Paco',
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should validate error', () => {
    const phrase = 'Paco?';

    const Component = () => {
        const name = 'firstName';
        const { errors, setError, values } = React.useContext(FormContext);
        const value = values[name];

        React.useEffect(() => {
            !errors[name] && value && setError(name, value);
        }, [errors, value, setError]);

        return (
            <>
                <Input name="firstName" />
                <p>{errors[name]}</p>}
            </>
        );
    };

    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;
    const input = document.querySelector('input');

    fireEvent.change(input as HTMLInputElement, {
        target: {
            value: phrase,
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should validate success', () => {
    const phrase = 'Paco!';

    const Component = () => {
        const name = 'firstName';
        const { successes, setSuccess, values } = React.useContext(FormContext);
        const value = values[name];

        React.useEffect(() => {
            !successes[name] && value && setSuccess(name, value);
        }, [successes, value, setSuccess]);

        return (
            <>
                <Input name="firstName" />
                <p>{successes[name]}</p>}
            </>
        );
    };

    render(
        <Form>
            <Component />
        </Form>
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const input = document.querySelector('input');

    fireEvent.change(input as HTMLInputElement, {
        target: {
            value: phrase,
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should change value of a input text', () => {
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
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;
    const input = document.querySelector('input');

    fireEvent.change(input as HTMLInputElement, {
        target: {
            value: 'Paco',
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a input text', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input id={'firstName'} defaultValue={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should add value of a textarea', () => {
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
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;
    const firstName = document.getElementById('firstName') as HTMLTextAreaElement;

    fireEvent.change(firstName, {
        target: {
            value: 'Paco',
        },
    });

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a textarea', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Textarea id={'firstName'} defaultValue={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should change checked radio element', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input name={'firstName'} type={'radio'} defaultValue={'Paco'} />
                <Input
                    defaultChecked={true}
                    name={'firstName'}
                    type={'radio'}
                    defaultValue={'Paca'}
                />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const input = document.querySelector('input') as HTMLInputElement;
    const form = document.getElementById('form') as HTMLFormElement;

    fireEvent.click(input);

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a radio element', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input defaultChecked={true} name={'firstName'} type={'radio'} value={'Paco'} />
                <Input name={'firstName'} type={'radio'} value={'Paca'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should change value of a checkbox element', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input name={'firstName1'} type={'checkbox'} value={'Paco'} />
                <Input name={'firstName2'} type={'checkbox'} value={'Paca'} />
                <p>My name is {values && values.firstName1}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const input = document.querySelector('input') as HTMLInputElement;
    const form = document.getElementById('form') as HTMLFormElement;

    fireEvent.click(input);

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a checkbox element', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Input defaultChecked={true} name={'firstName1'} type={'checkbox'} value={'Paco'} />
                <Input name={'firstName2'} type={'checkbox'} value={'Paca'} />
                {values ? <p>My name is {values.firstName1}</p> : null}
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should change value of a select element', () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const option = document.querySelector('option') as HTMLOptionElement;
    const form = document.getElementById('form') as HTMLFormElement;

    fireEvent.change(option);

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a select element', async () => {
    const phrase = 'My name is Paco';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select defaultValue={'Paco'} name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should change value of a select multiple element', async () => {
    const phrase = 'My name is PacoPaca';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select multiple name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    userEvent.selectOptions(form.querySelector('select') as HTMLSelectElement, ['Paca', 'Paco']);

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});

test('should set default value of a select multiple element', () => {
    const phrase = 'My name is PacoPaca';

    const Component = () => {
        const { values } = React.useContext(FormContext);

        return (
            <>
                <Select defaultValue={['Paca', 'Paco']} multiple name={'firstName'} />
                <p>My name is {values && values.firstName}</p>
            </>
        );
    };
    render(
        <Form id={'form'}>
            <Component />
        </Form>
    );

    const form = document.getElementById('form') as HTMLFormElement;

    expect(form.querySelector('p')?.innerHTML).toBe(phrase);
});
