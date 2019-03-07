import * as React from 'react';
import { create } from 'react-test-renderer';
import * as utils from '../src/utils';
import { Form, FormConsumer } from '../src/form';
import { Field } from '../src/field';
import { Validator, withValidation } from '../src/validator';
import { Validation } from '../src/validator/validator.types';

// @see: https://github.com/facebook/jest/issues/3465#issuecomment-398738112
jest.spyOn(utils, 'debounce').mockImplementation(fn => fn);

function submit(el: any) {
    el.props.onSubmit({ preventDefault: () => {} });
}

function change(el: any, value: any, type = 'text', checked = false) {
    el.props.onChange({
        preventDefault: () => {},
        target: { checked, selectedOptions: value, type, value },
    });
}

function changeSelectMultiple(el: any, values: Array<object | undefined> = []) {
    el.props.onChange({
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
const ErrorMessage = ({ name }: { name: string }) =>
    <FormConsumer>
        {({ errors }) =>
            <p>
                {errors[name]}
            </p>}
    </FormConsumer>;

test('handle submitted values', () => {
    let submittedValues;
    let count = 0;

    const onSubmit = ({ values }: any) => {
        submittedValues = values;
        count = ++count;
    };
    const instance = create(
        <div>
            <Form id={'form'} onSubmit={onSubmit}>
                <Input id={'firstName'} name={'firstName'} />
            </Form>
        </div>
    ).root;

    const form = instance.findByType('form');
    const input = instance.findByType('input');

    change(input, 'Paco');
    submit(form);

    expect(count).toBe(1);
    expect(submittedValues).toEqual({ firstName: 'Paco' });
});

test('handle submitted successes', () => {
    let submittedSuccesses: any;
    let count = 0;

    const onSubmit = ({ successes }: any) => {
        submittedSuccesses = successes;
        count = ++count;
    };
    const validation = ({ value, setSuccess }: Validation) => value && setSuccess(value);

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
    const firstName = instance.find(el => el.type == 'input' && el.props.id == 'firstName');
    const lastName = instance.find(el => el.type == 'input' && el.props.id == 'lastName');

    change(firstName, 'Paco Success');
    change(lastName, 'García Success');
    submit(form);

    expect(count).toBe(1);
    expect(submittedSuccesses).toEqual({
        firstName: 'Paco Success',
        lastName: 'García Success',
    });
});

test('handle submitted errors', () => {
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
    const firstName = instance.find(el => el.type == 'input' && el.props.id == 'firstName');
    const lastName = instance.find(el => el.type == 'input' && el.props.id == 'lastName');

    change(firstName, 'Paco Error');
    change(lastName, 'García Error');
    submit(form);

    expect(count).toBe(1);
    expect(submittedErrors).toEqual({
        firstName: errorMessage('Paco Error'),
        lastName: errorMessage('García Error'),
    });
});


test('handle reset values', () => {
    let count = 0;

    const onReset = () => {
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
    const firstName = instance.find(el => el.type == 'input' && el.props.name == 'firstName');
    const lastName = instance.find(el => el.type == 'input' && el.props.name == 'lastName');

    change(firstName, 'Paco');
    change(lastName, 'Pérez');

    expect({
        firstName: firstName.props.value,
        lastName: lastName.props.value,
    }).toEqual({
        firstName: 'Paco',
        lastName: 'Pérez',
    });

    form.props.onReset({ preventDefault: () => {} });

    expect(count).toBe(1);
    expect({
        firstName: firstName.props.value,
        lastName: lastName.props.value,
    }).toEqual({
        firstName: 'Paca',
        lastName: 'García',
    });
});

test('debounce wait milliseconds', () => {
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
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco');

    expect(wait).toEqual(8);
});

test('set initial values', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select id={'firstName'} value={'Paca'} name={'firstName'} />
                <Input value={'García'} name={'lastName'} />
                <Input value={'Female'} name={'gender'} type={'radio'} />
                <Input value={'Male'} name={'gender'} checked={true} type={'radio'} />
                <FormConsumer>
                    {({ initialValues }) => {
                        const { firstName, gender, lastName } = initialValues;

                        return <p>
                            {`${firstName} ${lastName} ${gender}`}
                        </p>
                    }}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children).toEqual('Paca García Male');
});


test('initial values is equal as values', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select id={'firstName'} value={'Paca'} name={'firstName'} />
                <Input value={'García'} name={'lastName'} />
                <Input value={'Female'} name={'gender'} type={'radio'} />
                <Input value={'Male'} name={'gender'} checked={true} type={'radio'} />
                <FormConsumer>
                    {({ initialValues, values }) => {
                        return <p>
                            {JSON.stringify(initialValues) === JSON.stringify(values)}
                        </p>
                    }}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children).toEqual(true);
});

test('consume values', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco');

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('consume errors', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco Error');

    expect(instance.findByType('p').props.children).toEqual(errorMessage('Paco Error'));
});

test('validate success', () => {
    const validation = ({ value, setSuccess }: Validation) => value && setSuccess(value);
    const SuccessMessage = ({ name }: { name: string }) =>
        <FormConsumer>
            {({ successes }) =>
                <p>
                    {successes[name]}
                </p>}
        </FormConsumer>;

    const instance = create(
        <div>
            <Form id={'form'}>
                {withValidation({
                    id: 'firstName',
                    name: 'firstName',
                    validation,
                })(Input)}
                <SuccessMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco!');

    expect(instance.findByType('p').props.children).toEqual('Paco!');
});

test('children onchange', () => {
    let changed = false;

    const instance = create(
        <div>
            <Form id={'form'}>
                <Validator name={'firstName'} validation={validation}>
                    <Input name={'firstName'} onChange={() => (changed = true)} />
                </Validator>
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco Error');

    expect(changed).toEqual(true);
});

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <p>Something went wrong</p>;
        }

        return this.props.children;
    }
}

test('form field without name', () => {
    const instance = create(
        <ErrorBoundary>
            <Input id={'firstName'} />
        </ErrorBoundary>
    ).root;

    const p = instance.findByType('p');

    expect(p.props.children).toEqual('Something went wrong');
});

test('input text element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco');

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('default value input text element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} value={'Paco'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('textarea element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Textarea id={'firstName'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const textarea = instance.findByType('textarea');

    change(textarea, 'Paco');

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('default value textarea element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Textarea id={'firstName'} value={'Paco'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('radio element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paco'} />
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paca'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const radios = instance.findAllByType('input');
    const paca = radios[1];

    change(paca, paca.props.value, paca.props.type, true);

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paca');
});

test('default checked radio element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} type={'radio'} value={'Paco'} />
                <Input
                    id={'firstName'}
                    checked={true}
                    name={'firstName'}
                    type={'radio'}
                    value={'Paca'}
                />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paca');
});

test('checkbox element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} type={'checkbox'} value={'Paco'} />
                <Input id={'lastName'} name={'lastName'} type={'checkbox'} value={'García'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const radios = instance.findAllByType('input');
    const paco = radios[0];

    change(paco, paco.props.value, paco.props.type, true);

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paco');
});

test('default checked checkbox element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Input id={'firstName'} name={'firstName'} type={'checkbox'} value={'Paco'} />
                <Input
                    id={'firstName'}
                    checked={true}
                    name={'firstName'}
                    type={'checkbox'}
                    value={'Paca'}
                />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paca');
});

test('select element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select id={'firstName'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const select = instance.findByType('select');

    change(select, 'Paca', 'select');

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paca');
});

test('default value select element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select id={'firstName'} value={'Paca'} name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My name is {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My name is Paca');
});

test('select multiple element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select id={'firstName'} multiple name={'firstName'} />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My names are {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;
    const select = instance.findByType('select');

    changeSelectMultiple(select, [{ value: 'Paca' }, { value: 'Paco' }]);

    expect(instance.findByType('p').props.children.join('')).toEqual('My names are Paca,Paco');
});

test('default value select multiple element', () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                <Select
                    id={'firstName'}
                    value={['Paca', 'Paco']}
                    multiple
                    name={'firstName'}
                />
                <FormConsumer>
                    {({ values }) =>
                        <p>
                            My names are {values && values.firstName}
                        </p>}
                </FormConsumer>
            </Form>
        </div>
    ).root;

    expect(instance.findByType('p').props.children.join('')).toEqual('My names are Paca,Paco');
});
