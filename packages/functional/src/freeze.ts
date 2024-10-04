// Type helper for Object.freeze
export const freeze = <T>(obj: T): Readonly<T> => Object.freeze(obj)
