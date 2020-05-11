import React, { useContext } from 'react';
import { FormContext } from '../../dist/react-form-core.cjs.development';

export const Context = () => {
    const { errors, initialValues, values, successes } = useContext(FormContext);

    return (
        <>
            <h2>FormContext:</h2>
            <pre>
                <code>{JSON.stringify({ errors, initialValues, values, successes }, null, 4)}</code>
            </pre>
        </>
    );
};
