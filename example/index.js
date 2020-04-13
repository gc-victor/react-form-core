import React from 'react';
import ReactDOM from 'react-dom';
import { Field, Form, FormConsumer, Validator } from '../dist';
import { Checkbox, Message, Radio, Select, Submitted, Text } from './components';

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
            text: 'Hello!',
        };

        this.resetSubmitted = this.resetSubmitted.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit({ ev, errors, values }) {
        const allowed = !Object.keys(errors).length && values.radio === '2';

        allowed && this.setState(() => ({ submitted: true }));
    }

    resetSubmitted() {
        this.setState(() => ({ submitted: false }));
    }

    validation({ value, setError, setSuccess }) {
        /error/.test(value) && setError('Error: Error Message!');
        /success/.test(value) && setSuccess('Well done!');
    }

    render() {
        return (
            <Form
                className={'p-6'}
                onChange={this.resetSubmitted}
                onReset={this.resetSubmitted}
                onSubmit={this.onSubmit}
            >
                <React.Fragment>
                    <div key={'text'}>
                        <label>
                            <span className={'block'}>Text</span>
                            <span className={'flex flex-col'}>
                                <Validator name={'input'} validation={this.validation}>
                                    <Text id={'input'} name={'input'} value={'test'} />
                                </Validator>
                                <span className={'block text-grey pt-1 text-sm'}>
                                    Type error or success (+ space) to show each or both messages
                                </span>
                            </span>
                        </label>
                        <Message name={'input'} />
                    </div>
                    <ul className={'list-reset mt-6'}>
                        <li key={'0'}>
                            <label>
                                <span>Checkbox 0</span>
                                <Checkbox name={'checkbox-0'} value={'0'} />
                            </label>
                        </li>
                        <li key={'1'}>
                            <label>
                                <span>Checkbox 1</span>
                                <Checkbox name={'checkbox-1'} value={'1'} />
                            </label>
                        </li>
                        <li key={'2'}>
                            <label>
                                <span>Checkbox 2</span>
                                <Checkbox name={'checkbox-2'} value={'2'} />
                            </label>
                        </li>
                        <Message name={'checkbox-0'} />
                        <Message name={'checkbox-1'} />
                        <Message name={'checkbox-2'} />
                    </ul>
                    <div key={'select'} className={'mt-6'}>
                        <label>
                            <span>Select</span>
                            <Validator name={'select'} validation={this.validation}>
                                <Select id={'select'} name={'select'} value={'1'} />
                            </Validator>
                            <span className={'block text-grey pt-1 text-sm'}>
                                Select 2 to enable the submit button
                            </span>
                        </label>
                        <Message name={'select'} />
                    </div>
                    <ul className={'list-reset mt-6'}>
                        <li key={'0'}>
                            <label>
                                <span>Radio 0</span>
                                <Radio name={'radio'} value={'0'} />
                            </label>
                        </li>
                        <li key={'1'}>
                            <label>
                                <span>Radio 1</span>
                                <Radio name={'radio'} value={'1'} checked={true} />
                            </label>
                        </li>
                        <li key={'2'}>
                            <label>
                                <span>Radio 2</span>
                                <Radio name={'radio'} value={'2'} />
                            </label>
                        </li>
                        <Message name={'radio'} />
                    </ul>
                    <div className={'mt-4'}>
                        <label>
                            <span className={'block'}>Textarea</span>
                            <Field name={'textarea'}>
                                <textarea
                                    className={
                                        'border border-grey-darker border-solid h-32 p-2 rounded w-1/2'
                                    }
                                    name={'textarea'}
                                />
                            </Field>
                        </label>
                        <Message name={'textarea'} />
                    </div>
                    <FormConsumer key={'warning'}>
                        {({ submitted, values }) => {
                            return (
                                submitted && (
                                    <React.Fragment>
                                        {values.radio !== '2' && (
                                            <p
                                                className={
                                                    'bg-yellow-lightest text-yellow-darker p-2 mt-2'
                                                }
                                            >
                                                Warning: Radio should be 2
                                            </p>
                                        )}
                                    </React.Fragment>
                                )
                            );
                        }}
                    </FormConsumer>
                    <Submitted submitted={this.state.submitted} />
                    <FormConsumer key={'submit'}>
                        {({ errors, values }) => {
                            const length = Object.keys(errors).length;
                            const disabled = !!(values.select !== '2' || length);

                            return (
                                <button
                                    className={`
                                        bg-blue
                                        font-semibold
                                        mt-4
                                        px-4
                                        py-2
                                        rounded
                                        text-white
                                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    disabled={disabled}
                                    type={'submit'}
                                >
                                    Submit
                                </button>
                            );
                        }}
                    </FormConsumer>
                    <button
                        className={`
                            bg-grey-lighter
                            font-semibold
                            ml-2
                            mt-4
                            px-4
                            py-2
                            rounded
                            text-black
                        `}
                        type={'reset'}
                    >
                        Reset
                    </button>
                    <ul className={'bg-blue-lightest list-reset mt-6 p-4'}>
                        <li className={'text-blue-dark'}>
                            <FormConsumer>
                                {({ initialValues }) => {
                                    return JSON.stringify({ initialValues });
                                }}
                            </FormConsumer>
                        </li>
                        <li className={'mt-4 text-blue-dark'}>
                            <FormConsumer>
                                {({ values }) => {
                                    return JSON.stringify({ values });
                                }}
                            </FormConsumer>
                        </li>
                        <li className={'mt-4 text-blue-dark'}>
                            <FormConsumer>
                                {({ errors }) => {
                                    return JSON.stringify({ errors });
                                }}
                            </FormConsumer>
                        </li>
                        <li className={'mt-4 text-blue-dark'}>
                            <FormConsumer>
                                {({ successes }) => {
                                    return JSON.stringify({ successes });
                                }}
                            </FormConsumer>
                        </li>
                    </ul>
                </React.Fragment>
            </Form>
        );
    }
}

ReactDOM.render(<Example />, document.getElementById('root'));
