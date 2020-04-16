import { omit } from '../src/utils';

test('omit none', () => {
    const obj = {
        firstName: 'Paco',
        lastName: 'García',
    };

    expect(omit(obj, ['none'])).toEqual(obj);
    expect(omit(obj, [])).toEqual(obj);
});

test('omit one item', () => {
    const obj = {
        firstName: 'Paco',
        lastName: 'García',
    };

    expect(omit(obj, ['lastName'])).toEqual({ firstName: 'Paco' });
});

test('omit all items', () => {
    const obj = {
        firstName: 'Paco',
        lastName: 'García',
    };

    expect(omit(obj, ['firstName', 'lastName'])).toEqual({});
});
