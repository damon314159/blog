// Define unique symbols to represent the type identifier for IO
const IO_SYMBOL: unique symbol = Symbol('IO')

// An Action is an impure function that yields a value of type T and never fails
type Action<T> = () => T

// IO is a wrapper that represents an impure Action that will eventually happen
type IO<T> = Readonly<{
  type: typeof IO_SYMBOL
  value: Action<T>
}>

// Constructor (also known as Pure or Return)
function Pure<T>(input: Action<T>): IO<T> {
  return Object.freeze({
    type: IO_SYMBOL,
    value: input,
  })
}

// Mappings take any value and map them without a wrapping
type IOMapping<T, U> = (input: T) => U

// Map the value that would be returned by the impure action
function map<T, U>(mapping: IOMapping<T, U>): (input: IO<T>) => IO<U> {
  return (input: IO<T>): IO<U> => Pure(() => mapping(input.value()))
}

// Bindings take any value and map them with a wrapping
type IOBinding<T, U> = (input: T) => IO<U>

// Binds to the value that would be returned by the impure action
function bind<T, U>(mapping: IOBinding<T, U>): (input: IO<T>) => IO<U> {
  return (input: IO<T>): IO<U> => Pure(() => mapping(input.value()).value())
}
