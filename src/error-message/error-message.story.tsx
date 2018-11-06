import React, { InputHTMLAttributes } from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { Form, FormConsumer } from '../form';
import { ErrorMessage } from './error-message.element';
import { withErrorMessage } from './error-message.with-error-message';
import Readme from './README.md';
import { Field } from '../field';

const validatorWithErrorMessage = (value: string) => (value ? 'Error: With Error Message!' : '');
const validator = (value: string) => (value ? 'Error: Error Message!' : '');
const asyncValidator = (value: string) =>
    new Promise(resolve => {
        setTimeout(() => value && resolve('Error: Async Validator Message!'), 500);
    });
const Input = ({ name = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) =>
    <Field name={name} {...rest}>
        <input {...rest} />
    </Field>;
const Message = ({ name }: { name: string }) =>
    <FormConsumer>
        {({ errors }) => {
            const message = errors && errors[name];

            return (
                message &&
                <p>
                    {errors[name]}
                </p>
            );
        }}
    </FormConsumer>;

storiesOf('ErrorMessage', module)
    .addDecorator(withReadme(Readme))
    .add('Component', () =>
        <Form>
            <label>
                <span>Error Message</span>
                <ErrorMessage name={'error'} validator={validator}>
                    <Input
                        id={'error'}
                        name={'error'}
                    />
                </ErrorMessage>
            </label>
            <Message name={'error'} />
        </Form>
    )
    .add('Wait 0', () =>
        <Form wait={0}>
            <label>
                <span>Error Message</span>
                <ErrorMessage name={'error'} validator={validator}>
                    <Input
                        id={'error'}
                        name={'error'}
                    />
                </ErrorMessage>
            </label>
            <Message name={'error'} />
        </Form>
    )
    .add('With Error HOC', () =>
        <Form>
            {
                <div>
                    <label>
                        <span>With Error</span>
                        {withErrorMessage({
                            name: 'withErrorMessage',
                            validator: validatorWithErrorMessage,
                        })(Input)}
                    </label>
                    <Message name={'withErrorMessage'} />
                </div>
            }
        </Form>
    )
    .add('Multiple Fields', () =>
        <Form>
            {
                <div>
                    <label>
                        <span>With Error</span>
                        {withErrorMessage({
                            name: 'withErrorMessage',
                            validator: validatorWithErrorMessage,
                        })(Input)}
                    </label>
                    <Message name={'withErrorMessage'} />
                </div>
            }
                <label>
                    <span>Error Message</span>
                    <ErrorMessage name={'error'} validator={validator}>
                        <Input
                            id={'error'}
                            name={'error'}
                        />
                    </ErrorMessage>
                </label>
                <Message name={'error'} />
        </Form>
    )
    .add('Async Validation', () =>
        <Form>
            {
                <div>
                    <label>
                        <span>Async Validator</span>
                        {withErrorMessage({
                            name: 'asyncValidator',
                            validator: asyncValidator,
                        })(Input)}
                    </label>
                    <Message name={'asyncValidator'} />
                </div>
            }
        </Form>
    );
