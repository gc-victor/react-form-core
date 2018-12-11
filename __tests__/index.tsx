import * as React from 'react';
import { create } from 'react-test-renderer';
import * as utils from '../src/utils';
import { Form, FormConsumer } from '../src/form';
import { Field } from '../src/field';
import { withErrorMessage } from '../src/error-message';

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
const validator = (value: any) => (value ? errorMessage(value) : '');
const asyncValidator = (value: string) => new Promise(resolve => resolve(errorMessage(value)));
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

    const handleSubmit = ({ values }: any) => {
        submittedValues = values;
        count = ++count;
    };
    const instance = create(
        <div>
            <Form id={'form'} handleSubmit={handleSubmit}>
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

test('handle submitted errors', () => {
    let submittedErrors: any;
    let count = 0;

    const handleSubmit = ({ errors }: any) => {
        submittedErrors = errors;
        count = ++count;
    };

    const instance = create(
        <div>
            <Form id={'form'} handleSubmit={handleSubmit}>
                {withErrorMessage({
                    id: 'firstName',
                    name: 'firstName',
                    validator,
                })(Input)}
                {withErrorMessage({
                    id: 'lastName',
                    name: 'lastName',
                    validator,
                })(Input)}
            </Form>
        </div>
    ).root;

    const form = instance.findByType('form');
    const firstName = instance.find(el => el.type == 'input' && el.props.id == 'firstName');
    const lastName = instance.find(el => el.type == 'input' && el.props.id == 'lastName');

    change(firstName, 'Paco');
    change(lastName, 'García');
    submit(form);

    expect(count).toBe(1);
    expect(submittedErrors).toEqual({
        firstName: errorMessage('Paco'),
        lastName: errorMessage('García'),
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
                {withErrorMessage({
                    id: 'firstName',
                    name: 'firstName',
                    validator,
                })(Input)}
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco');

    expect(wait).toEqual(8);
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
                {withErrorMessage({
                    id: 'firstName',
                    name: 'firstName',
                    validator,
                })(Input)}
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    change(input, 'Paco');

    expect(instance.findByType('p').props.children).toEqual(errorMessage('Paco'));
});

test('consume async error', async () => {
    const instance = create(
        <div>
            <Form id={'form'}>
                {withErrorMessage({
                    id: 'firstName',
                    name: 'firstName',
                    validator: asyncValidator,
                })(Input)}
                <ErrorMessage name={'firstName'} />
            </Form>
        </div>
    ).root;
    const input = instance.findByType('input');

    await change(input, 'Paco');

    expect(instance.findByType('p').props.children).toEqual(errorMessage('Paco'));
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
                <Input id={'firstName'} defaultValue={'Paco'} name={'firstName'} />
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
                <Textarea id={'firstName'} defaultValue={'Paco'} name={'firstName'} />
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
                    defaultChecked
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
                <Input
                    id={'firstName'}
                    name={'firstName'}
                    type={'checkbox'}
                    value={'Paco'}
                />
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
                    defaultChecked
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
                <Select id={'firstName'} defaultValue={'Paca'} name={'firstName'} />
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
                <Select id={'firstName'} defaultValue={['Paca', 'Paco']} multiple name={'firstName'} />
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
