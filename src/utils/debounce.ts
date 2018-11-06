// @see: https://30secondsofcode.org/function#debounce
export const debounce = (fn: (...args: any[]) => void, ms = 0) => {
    let timeout: any;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            fn.apply(null, args);
        }, ms);
    };
};
