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

const None: None = Object.freeze({
  type: NONE_SYMBOL,
})

function Pure<T>(input: T): Just<T> {
  return Object.freeze({
    type: JUST_SYMBOL,
    value: input,
  })
}

type MaybeMapping<T, U> = (input: T) => U

function map<T, U>(mapping: MaybeMapping<T, U>): (input: Maybe<T>) => Maybe<U> {
  return (input: Maybe<T>): Maybe<U> =>
    input.type === NONE_SYMBOL ? None : Pure(mapping(input.value))
}

type MaybeBinding<T, U> = (input: T) => Maybe<U>

function bind<T, U>(
  mapping: MaybeBinding<T, U>
): (input: Maybe<T>) => Maybe<U> {
  return (input: Maybe<T>): Maybe<U> =>
    input.type === NONE_SYMBOL ? None : mapping(input.value)
}

function match<T, U, V>(
  onNone: () => T,
  onJust: (input: U) => V
): (input: Maybe<U>) => T | V {
  return (input: Maybe<U>): T | V =>
    input.type === NONE_SYMBOL ? onNone() : onJust(input.value)
}

const Maybe = Object.freeze({
  None,
  Pure,
  map,
  bind,
  match,
})

export default Maybe

export type { Maybe, None, Just, MaybeMapping, MaybeBinding }
