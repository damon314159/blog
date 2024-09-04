type Fn = (value: never) => unknown

// Type of the argument of the first function in the pipe
type PipeInput<Fns extends Fn[]> = Parameters<Fns[0]>[0]

// Recursively apply one function at a time to check the types work all the way through
type Pipe<Fns extends Fn[], Input = PipeInput<Fns>> = Fns extends [
  infer Fn0 extends Fn,
  ...infer Rest extends Fn[],
]
  ? Rest extends [infer Fn1 extends Fn, ...Fn[]]
    ? ReturnType<Fn0> extends Parameters<Fn1>[0]
      ? Pipe<Rest, Input>
      : 'InvalidPipeError'
    : (value: Input) => ReturnType<Fn0>
  : never

// Type of the argument of the first function in the pipe
type Last<Fns extends Fn[]> = Fns extends [...Fn[], infer F] ? F : never
type ComposeInput<Fns extends Fn[]> = Parameters<Last<Fns>>[0]

// Recursively apply one function at a time to check the types work all the way through
type Compose<Fns extends Fn[], Input = ComposeInput<Fns>> = Fns extends [
  ...infer Rest extends Fn[],
  infer Fn0 extends Fn,
]
  ? Rest extends [...Fn[], infer Fn1 extends Fn]
    ? ReturnType<Fn0> extends Parameters<Fn1>[0]
      ? Compose<Rest, Input>
      : 'InvalidComposeError'
    : (value: Input) => ReturnType<Fn0>
  : never

// Test whether Pipe evaluated to 'InvalidPipeError' or not
type ErrorCheck<T> = T extends string ? T : unknown

// Reducer callback to be provided to functions.reduce when constructing a pipe
const reducer = <Arg, Ret>(result: Arg, nextFunction: (arg: Arg) => Ret): Ret =>
  nextFunction(result)

// Overloads for small numbers of arguments since any error messages are more direct
function pipe(): <Input>(arg: Input) => Input
function pipe<Input, A>(fn: (input: Input) => A): (arg: Input) => A
function pipe<Input, A, B>(
  fn0: (input: Input) => A,
  fn1: (input: A) => B
): (arg: Input) => B
function pipe<Input, A, B, C>(
  fn0: (input: Input) => A,
  fn1: (input: A) => B,
  fn2: (input: B) => C
): (arg: Input) => C
function pipe<Input, A, B, C, D>(
  fn0: (input: Input) => A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): (arg: Input) => D
function pipe<Input, A, B, C, D, E>(
  fn0: (input: Input) => A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): (arg: Input) => E
// Fallback overload for any larger number of arguments that recursively checks the types
function pipe<Fns extends Fn[], P extends Pipe<Fns>>(
  ...fns: Fns & ErrorCheck<P>
): P
// Takes a list of functions and returns a single function that applies them in sequence from left to right
function pipe<Fns extends Fn[], P extends Pipe<Fns>>(
  ...fns: Fns & ErrorCheck<P>
): P {
  return ((initialArg: PipeInput<Fns>) =>
    // @ts-expect-error The Pipe type ensures this is fine but TS reports it as an invalid overload of reduce
    fns.reduce(reducer, initialArg)) as P
}

export { pipe }

// Overloads for small numbers of arguments since any error messages are more direct
function compose(): <Input>(arg: Input) => Input
function compose<Input, A>(fn: (input: Input) => A): (arg: Input) => A
function compose<Input, A, B>(
  fn0: (input: A) => B,
  fn1: (input: Input) => A
): (arg: Input) => B
function compose<Input, A, B, C>(
  fn0: (input: B) => C,
  fn1: (input: A) => B,
  fn2: (input: Input) => A
): (arg: Input) => C
function compose<Input, A, B, C, D>(
  fn0: (input: C) => D,
  fn1: (input: B) => C,
  fn2: (input: A) => B,
  fn3: (input: Input) => A
): (arg: Input) => D
function compose<Input, A, B, C, D, E>(
  fn0: (input: D) => E,
  fn1: (input: C) => D,
  fn2: (input: B) => C,
  fn3: (input: A) => B,
  fn4: (input: Input) => A
): (arg: Input) => E
// Fallback overload for any larger number of arguments that recursively checks the types
function compose<Fns extends Fn[], C extends Compose<Fns>>(
  ...fns: Fns & ErrorCheck<C>
): C
// Takes a list of functions and returns a single function that applies them in sequence from left to right
function compose<Fns extends Fn[], C extends Compose<Fns>>(
  ...fns: Fns & ErrorCheck<C>
): C {
  return ((initialArg: ComposeInput<Fns>) =>
    // @ts-expect-error The Compose type ensures this is fine but TS reports it as an invalid overload of reduce
    fns.reduceRight(reducer, initialArg)) as C
}

export { compose }
