export interface Res<T> {
    status: 0 | 1,
    data: T,
    error: null | string
}