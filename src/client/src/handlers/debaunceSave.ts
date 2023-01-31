export const debounceSave = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let firstArg: any = undefined

    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        if (!firstArg) {
            firstArg = args
        }
        timeoutId = setTimeout(() => {
            fn.apply(this, [...firstArg, ...args])
            firstArg = undefined
        }, ms);
    };
};