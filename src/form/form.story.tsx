import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import Readme from './README.md';
import { Form } from './form';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { FormConsumer } from './form.consumer';
import { Field } from '../field';
import { Values } from './form.types';

const Input = ({ name = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
    <Field name={name}>
        <input {...rest} />
    </Field>
);
export const Radio = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input type={'radio'} {...rest} />
    </Field>;
export const Checkbox = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input type={'checkbox'} {...rest} />
    </Field>;
const Select = ({ name = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement>) =>
    <Field name={name}>
        <select {...rest}>
            <option value="Paco">Paco</option>
            <option value="Paca">Paca</option>
        </select>
    </Field>;
const SelectMultiple = ({ name = '', value = [''], ...rest }: SelectHTMLAttributes<HTMLSelectElement>) =>
    <Field name={name}>
        <Select {...rest} value={value} multiple />
    </Field>;
const Textarea = ({ name = '', ...rest }) => {
    return (
        <Field name={name} {...rest}>
            <textarea {...rest} />
        </Field>
    );
};

storiesOf('Form', module)
    .addDecorator(withReadme(Readme))
    .add('Component', () => (
        <Form>
            <label>
                <span>Form</span>
                <Input id={'name'} name={'name'} />
            </label>
        </Form>
    ))
    .add('Form Consumer', () => (
        <Form>
            <label>
                <span>Form Consumer</span>
                <Input id={'name'} name={'name'} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.name}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Input Text Default Value', () => (
        <Form>
            <label>
                <span>Input Text</span>
                <Input id={'name'} name={'name'} value={'Paco'} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.name}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Textarea Default Value', () => (
        <Form>
            <label>
                <span>Textarea</span>
                <Textarea id={'name'} name={'name'} value={'Paco'} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.name}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Select Default Value', () => (
        <Form>
            <label>
                <span>Select</span>
                <Select id={'name'} name={'name'} value={'Paca'} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.name}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Select Multiple Default Value', () => (
        <Form>
            <label>
                <span>Select Multiple</span>
                <SelectMultiple id={'name'} value={['Paca']} name={'name'} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.name}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Checkbox Default Checked', () => (
        <Form>
            <label>
                <span>Checkbox</span>
                <Checkbox name={'checkbox'} value={'Paca'} checked={true} />
            </label>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.checkbox}</p>}
            </FormConsumer>
        </Form>
    ))
    .add('Radio Default Checked', () => (
        <Form>
            <ul className={'list-reset mt-6'}>
                <li key={'0'}>
                    <label>
                        <span>Paco</span>
                        <Radio name={'radio'} value={'Paco'} />
                    </label>
                </li>
                <li key={'1'}>
                    <label>
                        <span>Paca</span>
                        <Radio name={'radio'} value={'Paca'} checked={true} />
                    </label>
                </li>
            </ul>
            <FormConsumer>
                {({ values }: { values: Values }) => <p>Value: {values && values.radio}</p>}
            </FormConsumer>
        </Form>
    ));
