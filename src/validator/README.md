# Validator

Validate form fields and, if needed, adds an error message.

## Props

-   name: the same name as the child form field element
-   validation: A function who validates the form field value. You can set the value as an error or a success.
    -   errors: object of errors in the whole form
    -   setError: set errors to get them using errors
    -   setSuccess: set successes to get them using successes
    -   successes: object of successes in the whole form
    -   value: field value
    -   values: object of values of the whole form

## Usage

The validator is agnostic, you can use you own validation or use a third party validation. The only requirement is to return a string.

You can see in the examples the two ways to use it. As a HOC or declaring it as a parent component of a form field element. Anyway isn't recommend to use it directly in most of the cases, as all form filed elements already integrates this component if the validator is defined.

### Examples

#### With Validation HOC

```
<Form>
    {withValidation({
         name: 'firstName',
         validation: ({ value, setError }) => value && setError('Error: is truthy!')
     })(Input)}
    <Submit>Submit</Submit>
</Form>
```

#### Validator Element

```
<Form>
    <Validator name={'firstName'} validation={({ value, setError }) => value && setError('Error: is truthy!')}>
        <Input name={'firstName'} />
    </Validator>
    <Submit>Submit</Submit>
</Form>
```

#### Asynchronous Validator Element

```
const validation = ({ value, setError }) => {
    const def = new Promise(resolve => {
        setTimeout(() => value && resolve('Error: Async Validator Message!'), 1000);
    });

    def.then(setError);
};

<Form>
    {withValidation({ name: 'firstName', validation })(Input)}
    <Submit>Submit</Submit>
</Form>
```

#### Success

```
<Form>
    <label>
        <span>Success</span>
        {withValidation({
            name: 'success',
            validation: ({ value, setSuccess }: Validation) => (value && setSuccess('Well done!')),
        })(Input)}
    </label>
    <SuccessMessage name={'success'} />
</Form>
```

#### Wait

Milliseconds to wait to validate the value. By default is 750ms.

```
<Form wait={0}>
    {withValidation({
         name: 'firstName',
         validation: ({ value, setError }) => value && setError('Error: is truthy!')
     })(Input)}
    <Submit>Submit</Submit>
</Form>
```
