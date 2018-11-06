import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import Readme from './README.md';
import { Form } from './form.component';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { FormConsumer } from './form.consumer';
import { Field } from '../field';

const Input = ({ name = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) =>
    <Field name={name}>
        <input {...rest} />
    </Field>;
const Select = ({ name = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement>) =>
    <Field name={name}>
        <select {...rest}>
            <option value="Paco">Paco</option>
            <option value="Paca">Paca</option>
        </select>
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
    .add('Component', () =>
        <Form>
            <label>
                <span>Form</span>
                <Input
                    id={'name'}
                    name={'name'}
                />
            </label>
        </Form>
    )
    .add('Form Consumer', () =>
        <Form>
            <label>
                <span>Form Consumer</span>
                <Input
                    id={'name'}
                    name={'name'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Input Text Default Value', () =>
        <Form>
            <label>
                <span>Input Text</span>
                <Input
                    id={'name'}
                    name={'name'}
                    defaultValue={'Paco'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Textarea Default Value', () =>
        <Form>
            <label>
                <span>Textarea</span>
                <Textarea
                    id={'name'}
                    name={'name'}
                    defaultValue={'Paco'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Select Default Value', () =>
        <Form>
            <label>
                <span>Select</span>
                <Select
                    id={'name'}
                    name={'name'}
                    defaultValue={'Paca'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Select Multiple Default Value', () =>
        <Form>
            <label>
                <span>Select Multiple</span>
                <Select
                    id={'name'}
                    defaultValue={['Paca']}
                    multiple
                    name={'name'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Checkbox Default Checked', () =>
        <Form>
            <label>
                <span>Checkbox</span>
                <Input
                    defaultChecked
                    id={'name'}
                    name={'name'}
                    type={'checkbox'}
                    value={'Paco'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    )
    .add('Radio Default Checked', () =>
        <Form>
            <label>
                <span>Paco</span>
                <Input
                    id={'name'}
                    name={'name'}
                    type={'radio'}
                    value={'Paco'}
                />
            </label>
            <label>
                <span>Paca</span>
                <Input
                    id={'name'}
                    defaultChecked
                    name={'name'}
                    type={'radio'}
                    value={'Paca'}
                />
            </label>
            <FormConsumer>
                {({ values }) =>
                    <p>
                        Value: {values && values.name}
                    </p>}
            </FormConsumer>
        </Form>
    );
