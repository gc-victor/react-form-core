// https://30secondsofcode.org/object#omit
export const omit = (obj: object, arr: any[]) =>
    Object.keys(obj).reduce((acc, key) => {
        if (!arr.includes(key)) {
            acc[key] = obj[key];
        }

        return acc;
    }, {});
