import * as React from 'react';
import { Field, FormConsumer } from '../dist';
import { Options } from './options';

export const Text = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input className={'border border-grey-darker border-solid p-2 rounded w-64'} {...rest} />
    </Field>;
export const Radio = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input className={'ml-2'} type={'radio'} {...rest} />
    </Field>;
export const Checkbox = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <input className={'ml-2'} type={'checkbox'} {...rest} />
    </Field>;
export const Select = ({ name = '', ...rest }) =>
    <Field name={name} {...rest}>
        <select className={'border border-grey-darker border-solid ml-2 p-2 rounded'} {...rest}>
            <Options />
        </select>
    </Field>;
export const Message = ({ name }) =>
    <FormConsumer>
        {({ errors, successes, values }) => {
            const errorMessage = errors && errors[name];
            const successMessage = successes && successes[name];
            const message = values && values[name];

            return (
                <React.Fragment>
                    {errorMessage &&
                    <p className={' bg-red-lightest text-red-dark p-2 mt-2'}>
                        {errorMessage}
                    </p>}
                    {successMessage &&
                    <p className={'bg-green-lightest text-green-dark p-2 mt-2'}>
                        {successMessage}
                    </p>}
                    {message &&
                    /\n/.test(message) &&
                    <div className={'bg-grey-lighter p-2 mt-2'}>
                        {message.split('\n').map(
                            (m, i) =>
                                m
                                    ? <p key={i}>
                                        {m}
                                    </p>
                                    : <br key={i}/>
                        )}
                    </div>}
                    {message &&
                    !/\n/.test(message) &&
                    <p className={'bg-grey-lighter p-2 mt-2'}>
                        {message}
                    </p>}
                </React.Fragment>
            );
        }}
    </FormConsumer>;
export const Submitted = ({ submitted }) =>
    <FormConsumer>
        {context => {
            return context.submitted && submitted
                ? <p className={'bg-green-lightest text-green-dark p-2 mt-2'}>Well done!</p>
                : false;
        }}
    </FormConsumer>;
