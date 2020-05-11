# React Form Core

React Form Core is a lightweight, only 1.11 kB, utility to create your form components easily. Just use the Form component, and it works out of the box.

## Install

You can use npm or yarn to install it.

`$ npm install --save react-form-core`

## Let's Play

First of all, let's create a Validator component to validate the values of the fields if it is required.

`./components/validator.js`

```
import React, { useContext } from 'react';
import { FormContext } from 'react-form-core';

export const Validator = ({ children, validation, name, ...rest }) => {
    const { errors, setError, setSuccess, successes, values } = React.useContext(FormContext);
    const element = children;
    const onChange = (ev) => {
        validation({
            errors,
            setError: (error) => setError(name, error),
            setSuccess: (success) => setSuccess(name, success),
            successes,
            value: ev.target.value,
            values,
        });
    };

    return React.cloneElement(element, {
        ...rest,
        onChange,
    });
};
```

Create a simple Field component wrapper with an error message. Use the FormContext to get and set data to the context of the form, and the Validation component to validate the field values.

`./components/field.js`

```
import React, { useContext } from 'react';
import { FormContext } from 'react-form-core';
import { Validator } from './validator';

export const Field = ({ children, label, name, validation }) => {
    const { errors } = useContext(FormContext);
    const errorMessage = errors && errors[name];
    const errorClassName = errorMessage ? 'has-error' : '';

    return (
        <label className={errorClassName}>
            <span>{label}</span>
            {validation ? (
                <Validator name={name} validation={validation}>
                    {children}
                </Validator>
            ) : (
                children
            )}
            {errorMessage && <span>{errorMessage}</span>}
        </label>
    );
};
```

Use the Field component to create an input.

`./components/input.js`

```
import React from 'react';
import { Field } from './components/field';

export const Input = ({ label, validation, ...rest }) => {
    return (
        <Field label={label} validation={validation} {...rest}>
            <input {...rest} />
        </Field>
    );
};
```

As you will need to submit the form, let's create a submit button and disabled it if there is an error. 

`./components/submit.js`

```
import React, { useContext } from 'react';
import { FormContext } from 'react-form-core';

export const Submit = ({ ...rest }) => {
    const { errors } = useContext(FormContext);
    const hasErrors = !!Object.keys(errors).length;

    return (
        <button disabled={hasErrors} type="submit" {...rest}>
            Submit
        </button>
    );
};
```

Add the components to the form and create the application view.

`./views/app.js` 

```
import React, { useContext } from 'react';
import { Form } from 'react-form-core';
import { Input } from './components/input';
import { Submit } from './components/submit';

export const App = () => {
    const validation = ({ value, setError }) => value && setError('Submit disabled ;)');
    const onSubmit={({ ev, errors, values }) => {
        // send the form using the values or the form event 
    }}

    return (
        <Form onSubmit={onSubmit}>
            <p><Input label={'First name: '} name={'firstName'} validation={validation} /></p>
            <p><Submit /></p>
        </Form>
    );
}
```

## FormContext API

API to get and set errors and successes messages, and get the values from the form.

- errors:

    Object of errors by field name

    `{ <name>: <error_message> }` 

- setError:

    Set errors by field name

    `setError(<name>, <error_message>)`

- setSuccess:
    
    Set successes by field name

    `setError(<name>, <success_message>)`

- successes:

    Object of successes by field name

    `{ <name>: <success_message> }`

- values:

    Object of values by field name

    `{ <name>: <value> }`

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

- MAJOR version when you make backwards-incompatible updates of any kind
- MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Commit message conventions

We are following *AngularJS Git Commit Message Conventions*. This leads to more readable messages that are easy to follow when looking through the project history.

- [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
- [Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone http://github.com/<your-username>/react-form-core`
-   Navigate to the newly cloned directory: `cd react-form-core`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/react-form-core/blob/master/LICENSE.md)
