import React from 'react';
import ReactDOM from 'react-dom';
import {
    Checkbox,
    Context,
    Message,
    Radio,
    Select,
    Submit,
    Submitted,
    Text,
    Warning,
} from './components';
import { Form, Validator } from '../dist/react-form-core.cjs.production.min';

const Example = () => {
    function validation({ value, setError, setSuccess }) {
        /error/.test(value) && setError('Error: Error Message!');
        /success/.test(value) && setSuccess('Well done!');
    }

    return (
        <Form className="p-6">
            <div key="text">
                <label>
                    <span className="block">Text</span>
                    <span className="flex flex-col">
                        <Validator name="input" validation={validation}>
                            <Text id="input" name="input" defaultValue="test" />
                        </Validator>
                        <span className="block text-grey pt-1 text-sm">
                            Type error or success to show each or both messages
                        </span>
                    </span>
                </label>
                <Message name="input" />
            </div>
            <ul className="list-reset mt-6">
                <li key="0">
                    <label>
                        <span>Checkbox 0</span>
                        <Checkbox name="checkbox-0" value="0" />
                    </label>
                </li>
                <li key="1">
                    <label>
                        <span>Checkbox 1</span>
                        <Checkbox name="checkbox-1" value="1" />
                    </label>
                </li>
                <li key="2">
                    <label>
                        <span>Checkbox 2</span>
                        <Checkbox name="checkbox-2" value="2" />
                    </label>
                </li>
                <Message name="checkbox-0" />
                <Message name="checkbox-1" />
                <Message name="checkbox-2" />
            </ul>
            <div key="select" className="mt-6">
                <label>
                    <span>Select</span>
                    <Validator name="select" validation={validation}>
                        <Select id="select" name="select" defaultValue="1" />
                    </Validator>
                    <span className="block text-grey pt-1 text-sm">
                        Select 2 to enable the submit button
                    </span>
                </label>
                <Message name="select" />
            </div>
            <ul className="list-reset mt-6">
                <li key="0">
                    <label>
                        <span>Radio 0</span>
                        <Radio name="radio" value="0" />
                    </label>
                </li>
                <li key="1">
                    <label>
                        <span>Radio 1</span>
                        <Radio name="radio" value="1" defaultChecked={true} />
                    </label>
                </li>
                <li key="2">
                    <label>
                        <span>Radio 2</span>
                        <Radio name="radio" value="2" />
                    </label>
                </li>
                <Message name="radio" />
            </ul>
            <div className="mt-4">
                <label>
                    <span className="block">Textarea</span>
                    <textarea
                        className="border border-grey-darker border-solid h-32 p-2 rounded w-1/2"
                        name="textarea"
                    />
                </label>
                <Message name="textarea" />
            </div>
            <Warning message="Radio should be 2" predicate={({ radio }) => radio !== '2'} />
            <Warning message="Input is required" predicate={({ input }) => !input} />
            <Submitted />
            <Submit />
            <button
                className="
                    bg-grey-lighter
                    font-semibold
                    ml-2
                    mt-4
                    px-4
                    py-2
                    rounded
                    text-black
                "
                type="reset"
            >
                Reset
            </button>
            <Context />
        </Form>
    );
};

ReactDOM.render(<Example />, document.getElementById('root'));
