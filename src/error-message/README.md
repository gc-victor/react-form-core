# ErrorMessage

Validate form fields and, if needed, adds an error message.

## Props

- name: the same name as the child form field element
- validator: A function who validates the form field value. It has to return a string with error message

## Usage

The validator is agnostic, you can use you own validation or use a third party validation. The only requirement is to return a string.

You can see in the examples the two ways to use it. As a HOC or declaring it as a parent component of a form field element. Anyway isn't recommend to use it directly in most of the cases, as all form filed elements already integrates this component if the validator is defined.

### Examples

#### With Error HOC

```
<Form>
    {withError({
         name: 'firstName',
         validator: value => value ? 'Error: is truthy!' : ''
     })(Input)}
    <Submit>Submit</Submit>
</Form>
```

#### Error Message Element

```
<Form>
    <ErrorMessageElement name={'firstName'} validator={value => value ? 'Error: is truthy!' : ''}>
        <Input name={'firstName'} />
    </ErrorMessageElement>
    <Submit>Submit</Submit>
</Form>
```

#### Asynchronous Error Message Element

```
const validator = (value: string) =>
    new Promise(resolve => {
        setTimeout(() => value && resolve('Error: is truthy!'), 200);
    });

<Form>
    {withError({ name: 'firstName', validator })(Input)}
    <Submit>Submit</Submit>
</Form>
```

#### Wait

Milliseconds to wait to validate the value. By default is 750ms.

```
<Form wait={0}>
    {withError({
         name: 'firstName',
         validator: value => value ? 'Error: is truthy!' : ''
     })(Input)}
    <Submit>Submit</Submit>
</Form>
```
