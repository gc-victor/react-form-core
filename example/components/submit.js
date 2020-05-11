import React, { useContext } from 'react';
import { FormContext } from '../../dist/react-form-core.cjs.development';

export const Submit = ({ ...rest }) => {
    const { errors } = useContext(FormContext);
    const hasErrors = !!Object.keys(errors).length;

    return (
        <button disabled={hasErrors} type="submit" {...rest}>
            Submit
        </button>
    );
};
