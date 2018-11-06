# Form

Component to manage form actions and events. It has the responsibility of handle his children values and errors. 

## Props

- handleSubmit: is used as a replacement of the onSubmit attribute. It will receive the properties ev (event), errors and values.
- wait: milliseconds to wait to validate the value, by default is 750ms 

## FormConsumer

- errors: object of errors in the whole form
- setError: set errors to get them using errors
- setValue: set value to get them using values
- values: object of values of the whole form

## Usage

### Examples

#### Handle Submit

```
<Form handleSubmit={({ ev, errors, values }) => {}}>
    <Input label={'First name'} name={'firstName'} />
    <Submit>Submit</Submit>
</Form>
```

#### Wait

```
<Form wait={0}>
    <ErrorMessage name={'firstName'} validator={validator}>
        <Input
            id={'firstName'}
            name={'firstName'}
        />
    </ErrorMessage>
    <Submit>Submit</Submit>
</Form>
```

#### FormConsumer

##### Errors

```
<Form>
    <FormConsumer>
        {({ errors }) =>
            Object.keys(errors).length && <p>Error: {errors.firstName}</p>
        }
    </FormConsumer>
</Form>
```

##### Set Errors and Values

```
<Form>
    <FormConsumer>
        {({ setError, setValues }) =>
            setValues('firstName', 'No name');
            setError('firstName', 'Error message!');
        }
    </FormConsumer>
</Form>
```

##### Values

```
<Form>
    <FormConsumer>
        {({ values }) =>
            <p>Value: {values && values.firstName}</p>
        }
    </FormConsumer>
</Form>
```

## References

- [Form with the new React Context API](https://medium.com/@ippei.tanaka/form-with-the-new-react-context-api-12e3ba601b3d)
- [React form example with context](https://github.com/ippei-tanaka/react-form-example-with-context)
