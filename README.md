# React Form Core

React Form Core is an utility to create your own form elements components

## Install

You can use npm or yarn to install it.

`$ npm install --save react-form-core`

`$ yarn add react-form-core`

## Components

### Error Message

Validate form fields and, if needed, adds an error message. 

```
import { Form, ErrorMessageElement } from 'react-form-core';
import { Input } from './components/input';
import { Submit } from './components/submit';

<Form>
    <ErrorMessageElement name={'firstName'} validator={value => value ? 'Error: is truthy!' : ''}>
        <Input name={'firstName'} />
    </ErrorMessageElement>
    <Submit>Submit</Submit>
</Form>
```

[More about the error message component.](./src/error-message/README.md)

### Field

Field element is a wrapper for your form fields elements. It is in charge of setting the value of the field to the form context.

```
import { Field } from 'react-form-core';

const Input = (label, name, ...rest) =>
    <label>
        <span>{label}</span>
        <Field name={name}>
            <input ...rest />
        <Field/>
    </label>;
```

[More about the field component.](./src/field/README.md)

### Form

Component to manage form actions and events. It has the responsibility of handle his children values and errors.

```
import { Form } from 'react-form-core';
import { Input } from './components/input';
import { Submit } from './components/submit';

<Form handleSubmit={({ ev, errors, values }) => {}}>
    <Input label={'First name'} name={'firstName'} />
    <Submit>Submit</Submit>
</Form>
```

#### FormConsumer

```
import { Form, FormConsumer } from 'react-form-core';

<Form>
    <FormConsumer>
        {({ values }) =>
            <p>Value: {values && values.firstName}</p>
        }
    </FormConsumer>
</Form>
```

[More about the form component.](./src/form/README.md)

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

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone http://git.trivago.trv/<your-username>/react-form-core`
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
