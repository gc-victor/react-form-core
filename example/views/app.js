import * as React from 'react';
import { Form } from '../../dist/react-form-core.cjs.development';
import { Input } from '../components/input';
import { Textarea } from '../components/textarea';
import { Context } from '../components/context';
import { Submit } from '../components/submit';
import { Radio } from '../components/radio';
import { Checkbox } from '../components/checkbox';
import { Select } from '../components/select';

export const App = () => {
    // Validates the form fields and, if needed, the Field component will add an error message.
    const validation = ({ value, setError }) => value && setError('Submit disabled ;)');
    const onSubmit = ({ ev, errors, values }) => {
        // send the form using the values or the form event
    };

    return (
        <>
            <h1>React Form Core</h1>
            <Form onSubmit={onSubmit}>
                <fieldset>
                    <legend>Input</legend>
                    <p>
                        <label>
                            <span>Native input: </span>
                            <input name="native-input" defaultValue="native input" />
                        </label>
                    </p>
                    <p>
                        <Input
                            label="Without validation: "
                            name="input-without-validation"
                            defaultValue="without validation"
                        />
                    </p>
                    <p>
                        <Input
                            label="With validation: "
                            name="input-with-validation"
                            validation={validation}
                        />
                    </p>
                    <p>
                        <Input label="Number: " name="input-number" type="number" />
                    </p>
                    <p>
                        <Input
                            label="Password: "
                            name="input-password"
                            type="password"
                            autoComplete="password"
                        />
                    </p>
                    <p>
                        <Input
                            label="Color: "
                            name="input-color"
                            type="color"
                            defaultValue="#000000"
                        />
                    </p>
                    <p>
                        <Input label="File: " name="input-file" type="file" />
                    </p>
                    <p>
                        <Input label="Range: " name="input-range" type="range" />
                    </p>
                    <p>
                        <Input label="Date: " name="input-date" type="date" />
                    </p>
                    <input name="input-hidden" type="hidden" value="hidden" />
                </fieldset>
                <fieldset>
                    <legend>Radio</legend>
                    <ol>
                        <li>
                            <Radio label="Radio: " name="radio" value="1" />
                        </li>
                        <li>
                            <Radio defaultChecked={true} label="Radio: " name="radio" value="2" />
                        </li>
                        <li>
                            <Radio label="Radio: " name="radio" value="3" />
                        </li>
                    </ol>
                </fieldset>
                <fieldset>
                    <legend>Checkbox</legend>
                    <ol>
                        <li>
                            <Checkbox label="Checkbox: " name="checkbox1" value="1" />
                        </li>
                        <li>
                            <Checkbox
                                defaultChecked={true}
                                label="Checkbox: "
                                name="checkbox2"
                                value="2"
                            />
                        </li>
                        <li>
                            <Checkbox label="Checkbox: " name="checkbox3" value="3" />
                        </li>
                    </ol>
                </fieldset>
                <fieldset>
                    <legend>Select</legend>
                    <p>
                        <Select label="Select: " name="select">
                            <option value="1000">1000</option>
                            <option value="2000">2000</option>
                            <option value="3000">3000</option>
                        </Select>
                    </p>
                    <p>
                        <Select label="Multiple Select: " multiple name="multiple-select">
                            <option value="1000">1000</option>
                            <option value="2000">2000</option>
                            <option value="3000">3000</option>
                        </Select>
                    </p>
                </fieldset>
                <fieldset>
                    <legend>Textarea</legend>
                    <p>
                        <Textarea label="Textarea: " name="textarea" defaultValue="Some text" />
                    </p>
                </fieldset>
                <p>
                    <Submit />
                </p>
                <p>
                    <button type="reset">Reset</button>
                </p>
                <Context />
            </Form>
        </>
    );
};
