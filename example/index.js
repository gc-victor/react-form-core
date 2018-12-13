import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Field, ErrorMessage, FormConsumer } from '../dist';

const validator = value => (/error/.test(value) ? 'Error: Error Message!' : '');
const Input = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input {...rest} />
    </Field>;
const Select = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <select {...rest}>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
    </Field>;
const Message = ({ name }) =>
    <FormConsumer>
        {({ errors, values }) => {
            const errorMessage = errors && errors[name];
            const message = values && values[name];

            return <React.Fragment>
                {
                    errorMessage &&
                    <p>
                        {errorMessage}
                    </p>
                }
                {
                    message &&
                    <p>
                        {message}
                    </p>
                }
            </React.Fragment>;
        }}
    </FormConsumer>;

ReactDOM.render(
    <Form>
        <div>
            <label>
                <span>Error Message</span>
                <ErrorMessage name={'input'} validator={validator}>
                    <Input id={'input'} name={'input'} defaultValue={'test'} />
                </ErrorMessage>
            </label>
            <Message name={'input'} />
        </div>
        <div>
            <label>
                <span>Select</span>
                <ErrorMessage name={'select'} validator={validator}>
                    <Select id={'select'} name={'select'} defaultValue={'1'} />
                </ErrorMessage>
            </label>
            <Message name={'select'} />
        </div>
    </Form>,
    document.getElementById('root')
);
