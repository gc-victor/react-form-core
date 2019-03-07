import React, { InputHTMLAttributes } from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { Errors, Form, FormConsumer, Successes } from '../form';
import { Validator } from './validator.element';
import { withValidation } from './validator.with-validation';
import Readme from './README.md';
import { Field } from '../field';
import { Validation } from './validator.types';

const validation = ({ value, setError }: Validation) => value && setError('Error: Error Message!');
const asyncValidator = ({ value, setError }: Validation) => {
    const def = new Promise(resolve => {
        setTimeout(() => value && resolve('Error: Async Validator Message!'), 1000);
    });

    def.then(setError);
};
const successValidation = ({ value, setSuccess }: Validation) =>
    value && setSuccess('Well done!');
const Input = ({ name = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) =>
    <Field name={name} {...rest}>
        <input {...rest} />
    </Field>;
const Message = ({ name }: { name: string }) =>
    <FormConsumer>
        {({ errors }: { errors: Errors }) => {
            const message = errors && errors[name];

            return (
                message &&
                <p>
                    {errors[name]}
                </p>
            );
        }}
    </FormConsumer>;
const SuccessMessage = ({ name }: { name: string }) =>
    <FormConsumer>
        {({ successes }: { successes: Successes }) => {
            const message = successes && successes[name];

            return (
                message &&
                <p>
                    {successes[name]}
                </p>
            );
        }}
    </FormConsumer>;

storiesOf('Validator', module)
    .addDecorator(withReadme(Readme))
    .add('Component', () =>
        <Form>
            <label>
                <span>Validator</span>
                <Validator name={'error'} validation={validation}>
                    <Input id={'error'} name={'error'} />
                </Validator>
            </label>
            <Message name={'error'} />
        </Form>
    )
    .add('Wait 0', () =>
        <Form wait={0}>
            <label>
                <span>Validator</span>
                <Validator name={'error'} validation={validation}>
                    <Input id={'error'} name={'error'} />
                </Validator>
            </label>
            <Message name={'error'} />
        </Form>
    )
    .add('With Validation HOC', () =>
        <Form>
            {
                <div>
                    <label>
                        <span>With Validation</span>
                        {withValidation({
                            name: 'withValidation',
                            validation,
                        })(Input)}
                    </label>
                    <Message name={'withValidation'} />
                </div>
            }
        </Form>
    )
    .add('Multiple Fields', () =>
        <Form>
            {
                <div>
                    <label>
                        <span>With Validation</span>
                        {withValidation({
                            name: 'withValidation',
                            validation,
                        })(Input)}
                    </label>
                    <Message name={'withValidation'} />
                </div>
            }
            <label>
                <span>Validator</span>
                <Validator name={'error'} validation={validation}>
                    <Input id={'error'} name={'error'} />
                </Validator>
            </label>
            <Message name={'error'} />
        </Form>
    )
    .add('Async Validation', () =>
        <Form>
            <label>
                <span>Async Validator</span>
                {withValidation({
                    name: 'asyncValidator',
                    validation: asyncValidator,
                })(Input)}
            </label>
            <Message name={'asyncValidator'} />
        </Form>
    )
    .add('Success', () =>
        <Form>
            <label>
                <span>Success</span>
                {withValidation({
                    name: 'success',
                    validation: successValidation,
                })(Input)}
            </label>
            <SuccessMessage name={'success'} />
        </Form>
    );
