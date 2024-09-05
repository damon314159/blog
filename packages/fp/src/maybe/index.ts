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

type MPure<T> = (input: T) => Just<T>
function MPure<T>(input: T): Just<T> {
  return Object.freeze({
    type: JUST_SYMBOL,
    value: input,
  })
}

type MMap<T, U> = (input: T) => Maybe<U>

type MBind<T, U> = (map: MMap<T, U>) => (input: Maybe<T>) => Maybe<U>
function MBind<T, U>(map: MMap<T, U>): (input: Maybe<T>) => Maybe<U> {
  return (input: Maybe<T>): Maybe<U> =>
    input.type === NONE_SYMBOL ? None : map(input.value)
}
