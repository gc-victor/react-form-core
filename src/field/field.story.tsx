import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { withReadme } from 'storybook-readme';
import Readme from './README.md';
import { Field } from './field.element';
import { Form } from '../form';

storiesOf('Field', module)
    .addDecorator(withReadme(Readme))
    .add('Component', () =>
        <Form>
            <label>
                <span>Input Field</span>
                <Field name={'input'}>
                    <input />
                </Field>
            </label>
        </Form>
    );
