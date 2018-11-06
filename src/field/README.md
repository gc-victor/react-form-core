# Field

Field element is a wrapper for your form fields elements. It is in charge of setting the value of the field to the form context.

## Props

- name: the same name as the needed for the child form field element

## Usage

The field component is a helper to create your components.

### Example

```
const Input = (label, name, ...rest) =>
    <label>
        <span>{label}</span>
        <Field name={name}>
            <input ...rest />
        <Field/>
    </label>;
```
