// Define unique symbols to represent the type identifier for IO
const IO_SYMBOL: unique symbol = Symbol('IO')

// An Action is an impure function that yields a value and never fails
type Action<Args extends unknown[], Ret> = (...args: Args) => Ret

// IO is a wrapper that represents an impure Action that will eventually happen
type IO<Args extends unknown[], Ret> = Readonly<{
  type: typeof IO_SYMBOL
  value: Action<Args, Ret>
}>

// Constructor (also known as Pure or Return)
function Pure<Args extends unknown[], Ret>(
  input: Action<Args, Ret>
): IO<Args, Ret> {
  return Object.freeze({
    type: IO_SYMBOL,
    value: input,
  })
}
