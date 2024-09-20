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
