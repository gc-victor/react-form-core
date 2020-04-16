import * as React from 'react';
import { FormContext } from '../dist/react-form-core.cjs.production.min';

export const Text = ({ ...rest }) => (
    <input className={'border border-grey-darker border-solid p-2 rounded w-64'} {...rest} />
);
export const Radio = ({ ...rest }) => <input className={'ml-2'} type={'radio'} {...rest} />;
export const Checkbox = ({ ...rest }) => <input className={'ml-2'} type={'checkbox'} {...rest} />;
export const Select = ({ ...rest }) => (
    <select className={'border border-grey-darker border-solid ml-2 p-2 rounded'} {...rest}>
        <option value="0">0</option>
        <option value="1">10000</option>
        <option value="2">2</option>
    </select>
);

export const Message = ({ name }) => {
    const { errors, successes, values } = React.useContext(FormContext);
    const errorMessage = errors && errors[name];
    const successMessage = successes && successes[name];
    const message = values && values[name];

    return (
        <ul className="list-reset">
            {errorMessage && (
                <li className={' bg-red-lightest text-red-dark p-2 mt-2'}>{errorMessage}</li>
            )}
            {successMessage && (
                <li className={'bg-green-lightest text-green-dark p-2 mt-2'}>{successMessage}</li>
            )}
            {message && /\n/.test(message) && (
                <ul className={'bg-grey-lighter p-2 mt-2'}>
                    {message.split('\n').map((m, i) => (m ? <li key={i}>{m}</li> : null))}
                </ul>
            )}
            {message && !/\n/.test(message) && (
                <li className={'bg-grey-lighter p-2 mt-2'}>{message}</li>
            )}
        </ul>
    );
};

export const Warning = ({ message, predicate }) => {
    const { values } = React.useContext(FormContext);

    return (
        predicate(values) && (
            <p className={'bg-yellow-lightest text-yellow-darker p-2 mt-2'}>
                Warning: {message}
            </p>
        )
    );
};

export const Submitted = () => {
    const context = React.useContext(FormContext);

    return context.submitted ? (
        <p className={'bg-green-lightest text-green-dark p-2 mt-2'}>Well done!</p>
    ) : null;
};

export const Submit = () => {
    const { errors, values } = React.useContext(FormContext);
    const hasErrors = Object.keys(errors).length;
    const hasInput = values.input;
    const isSelectTwo = values.select === '2';
    const isRadioTwo = values.radio === '2';
    const disabled = (!hasInput && !isSelectTwo && !isRadioTwo) || hasErrors;

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
};

export const Context = () => {
    const { errors, initialValues, values, successes } = React.useContext(FormContext);

    return (
        <ul className={'bg-blue-lightest list-reset mt-6 p-4'}>
            <li className={'text-blue-dark'}>{JSON.stringify({ initialValues })}</li>
            <li className={'mt-4 text-blue-dark'}>{JSON.stringify({ values })}</li>
            <li className={'mt-4 text-blue-dark'}>{JSON.stringify({ errors })}</li>
            <li className={'mt-4 text-blue-dark'}>{JSON.stringify({ successes })}</li>
        </ul>
    );
};
