// Define unique symbols to represent the type identifiers for Left and Right
const LEFT_SYMBOL: unique symbol = Symbol('Left')
const RIGHT_SYMBOL: unique symbol = Symbol('Right')

// `Left<L>` is a type that contains a left value
type Left<L> = Readonly<{
  type: typeof LEFT_SYMBOL
  value: L
}>

// `Right<R>` is a type that contains a left value
type Right<R> = Readonly<{
  type: typeof RIGHT_SYMBOL
  value: R
}>

// Either is the union of Left and Right
type Either<L, R> = Left<L> | Right<R>

function Pure<R>(input: R): Right<R> {
  return Object.freeze({
    type: RIGHT_SYMBOL,
    value: input,
  })
}
function PureL<L>(input: L): Left<L> {
  return Object.freeze({
    type: LEFT_SYMBOL,
    value: input,
  })
}

type EitherMapping<R, Ret> = (input: R) => Ret
type EitherMappingL<L, Ret> = (input: L) => Ret

function map<L, RetL, R, RetR>(
  mappingL: EitherMappingL<L, RetL>,
  mapping: EitherMapping<R, RetR>
): (input: Either<L, R>) => Either<RetL, RetR> {
  return (input: Either<L, R>): Either<RetL, RetR> =>
    input.type === LEFT_SYMBOL
      ? PureL(mappingL(input.value))
      : Pure(mapping(input.value))
}

function mapR<L, R, RetR>(
  mapping: EitherMapping<R, RetR>
): (input: Either<L, R>) => Either<L, RetR> {
  return (input: Either<L, R>): Either<L, RetR> =>
    input.type === LEFT_SYMBOL ? input : Pure(mapping(input.value))
}

function mapL<L, R, RetL>(
  mapping: EitherMappingL<L, RetL>
): (input: Either<L, R>) => Either<RetL, R> {
  return (input: Either<L, R>): Either<RetL, R> =>
    input.type === LEFT_SYMBOL ? PureL(mapping(input.value)) : input
}

type EitherBinding<R, RToL, RToR> = (input: R) => Either<RToL, RToR>
type EitherBindingL<L, RToL, RToR> = (input: L) => Either<RToL, RToR>

function bind<L, LToL, LToR, R, RToL, RToR>(
  mappingL: EitherBindingL<L, LToL, LToR>,
  mapping: EitherBinding<R, RToL, RToR>
): (input: Either<L, R>) => Either<LToL | RToL, LToR | RToR> {
  return (input: Either<L, R>): Either<LToL | RToL, LToR | RToR> =>
    input.type === LEFT_SYMBOL ? mappingL(input.value) : mapping(input.value)
}

function bindR<L, R, RToL, RToR>(
  mapping: EitherBinding<R, RToL, RToR>
): (input: Either<L, R>) => Either<L | RToL, RToR> {
  return (input: Either<L, R>): Either<L | RToL, RToR> =>
    input.type === LEFT_SYMBOL ? input : mapping(input.value)
}

function bindL<L, LToL, LToR, R>(
  mapping: EitherBindingL<L, LToL, LToR>
): (input: Either<L, R>) => Either<LToL, LToR | R> {
  return (input: Either<L, R>): Either<LToL, LToR | R> =>
    input.type === LEFT_SYMBOL ? mapping(input.value) : input
}

function match<L, RetL, R, RetR>(
  onLeft: (input: L) => RetL,
  onRight: (input: R) => RetR
): (input: Either<L, R>) => RetL | RetR {
  return (input: Either<L, R>): RetL | RetR =>
    input.type === LEFT_SYMBOL ? onLeft(input.value) : onRight(input.value)
}

const either = Object.freeze({
  Pure,
  PureL,
  map,
  mapR,
  mapL,
  bind,
  bindR,
  bindL,
  match,
})

export default either

export type {
  Either,
  Left,
  Right,
  EitherMapping,
  EitherMappingL,
  EitherBinding,
  EitherBindingL,
}
