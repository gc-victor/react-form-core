import React, { InputHTMLAttributes } from 'react';
import ReactDOM from 'react-dom';
import { Form, Field, ErrorMessage, FormConsumer } from '../dist';

const validator = (value) => (value ? 'Error: Error Message!' : '');
const Input = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input {...rest} />
    </Field>;
const Message = ({ name }) =>
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

ReactDOM.render(
    <Form>
        <label>
            <span>Error Message</span>
            <ErrorMessage name={'error'} validator={validator}>
                <Input id={'error'} name={'error'} />
            </ErrorMessage>
        </label>
        <Message name={'error'} />
    </Form>,
    document.getElementById('root')
);
