# React Form Core

React Form Core is a lightweight, only 1.37 kB (Minified + Gzipped), utility to create your form components easily. Just use the Form component and it works out of the box.

The Form component to manage form actions and events. With the responsibility of handle its children changes and its operations. It maintains a context of the form to use it as you wish.

The library also provides a simple Validation component and a HOC (withValidation).

## Install

You can use npm or yarn to install it.

`$ npm install --save react-form-core`

`$ yarn add react-form-core`

## Let's Play

Create a simple Field component wrapper with an error message. Use the FormContext to get and set data to the context of the form, and the HOC withValidation to validate the field value.  

`./components/field.js`

```
import { FormContext, withValidation } from 'react-form-core';

export const Field = ({
    children,
    label,
    name,
    validation,
    ...rest
}) => {
    const { errors, values } = React.useContext(FormContext);
    const errorMessage = errors && errors[name];
    const errorClassName = errorMessage ? 'has-error' : '';
    const ChildrenField = (props) => React.cloneElement(children, props);
    const childrenField = validation ? (
        withValidation({ name, validation, ...rest })(ChildField)
    ) : (
        <ChildrenField {...rest} />
    );

    return (
        <label className={errorClassName}>
            <span>{label}</span>
            {childrenField}
            {errorMessage && <p>{errorMessage}<p>}
        </label>
    );
};
```

Use the Field component to create a basic input.

`./components/input.js`

```
import { Field } from './components/field';

export const Input = (props) => {
    return <Field {...props}>
        <input {...props} />
    </Field>   
}
```

As you will need to submit the form, let's create a submit button and disabled it if there is an error. 

`./components/submit.js`

```
export const Submit = ({ ...rest }) => {
    const { errors, values } = React.useContext(FormContext);
    const hasErrors = Object.keys(errors).length;

    return <button disabled={hasErrors} type="submit" {...rest}>Submit</button>   
}
```

Is time to use your components in the form.

`./views/form.js` 

```
import { Form } from 'react-form-core';
import { Input } from './components/input';
import { Submit } from './components/submit';

// Validates the form fields and, if needed, the Field component will add an error message.
const validation = ({ value, setError }) => value && setError('Ooooh!')
const onSubmit={({ ev, errors, values }) => {
    // send the form using the values or the form event 
}}

export const App = () => {
    return <Form onSubmit={onSubmit}>
        <Input label={'First name'} name={'firstName'} />
        <Submit />
    </Form>
}
```

## Context API

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
