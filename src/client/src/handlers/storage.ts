
interface StorageR {
    get: () => string,
    set: (p: string) => void
}

export function StorageR() {
    let r: string = ""
    const meth: StorageR = {
        get: () => r,
        set(p) {
            if (!r) {
                r = p
            }
        },
    }
    return meth
}