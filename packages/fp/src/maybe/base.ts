// Define unique symbols to represent the type identifiers for None and Just
const NONE_SYMBOL: unique symbol = Symbol('None')
const JUST_SYMBOL: unique symbol = Symbol('Just')

// `None` is a type with no value, representing the absence of a value
type None = Readonly<{
  type: typeof NONE_SYMBOL
}>

// `Just<T>` is a type that contains a value of type `T`
type Just<T> = Readonly<{
  type: typeof JUST_SYMBOL
  value: T
}>

// Maybe is the union of None and Just
type Maybe<T> = None | Just<T>

// Static None value
const None: None = Object.freeze({
  type: NONE_SYMBOL,
})

// Constructor (also known as Pure or Return) for Just values
function Pure<T>(input: T): Just<T> {
  return Object.freeze({
    type: JUST_SYMBOL,
    value: input,
  })
}

// Mappings take any value and map them without a wrapping. The input type may be a Maybe
type MaybeMapping<T, U> = (input: T) => U

// Map None to None or apply the mapping to a Just value
function map<T, U>(mapping: MaybeMapping<T, U>): (input: Maybe<T>) => Maybe<U> {
  return (input: Maybe<T>): Maybe<U> =>
    input.type === NONE_SYMBOL ? None : Pure(mapping(input.value))
}

// Bindings take any value and map them with a wrapping. The input type may be a Maybe
type MaybeBinding<T, U> = (input: T) => Maybe<U>

// Binds None to None or apply the binding to a Just value
function bind<T, U>(
  mapping: MaybeBinding<T, U>
): (input: Maybe<T>) => Maybe<U> {
  return (input: Maybe<T>): Maybe<U> =>
    input.type === NONE_SYMBOL ? None : mapping(input.value)
}

// Extract the values of the Maybe, providing callbacks for None and Just
function match<T, U, V>(
  onNone: () => T,
  onJust: (input: U) => V
): (input: Maybe<U>) => T | V {
  return (input: Maybe<U>): T | V =>
    input.type === NONE_SYMBOL ? onNone() : onJust(input.value)
}

const maybe = Object.freeze({
  None,
  Pure,
  map,
  bind,
  match,
})

export default maybe

export type { Maybe, None, Just, MaybeMapping, MaybeBinding }
