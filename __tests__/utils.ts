import { omit, debounce } from '../src/utils';

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

jest.useFakeTimers();

test('debounce', () => {
    const callback = jest.fn();
    const fn = debounce(callback, 100);
    const fnZero = debounce(callback);

    fn('Paco');
    fnZero();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(2);
});
