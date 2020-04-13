interface Obj {
    [key: string]: any
}

// https://30secondsofcode.org/object#omit
export const omit = (obj: Obj, arr: any[]) => {
    return Object.keys(obj).reduce((acc: Obj, key: string) => {
        if (!arr.includes(key)) {
            acc[key] = obj[key];
        }

        return acc;
    }, {});
};
