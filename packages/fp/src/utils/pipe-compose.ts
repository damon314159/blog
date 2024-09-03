// Generic callback to be provided to either reduce or reduceRight when piping or composing functions
const reducer = (result: unknown, nextFunction: Function): unknown =>
  nextFunction(result)

// Generic callback to be provided to either reduce or reduceRight when piping or composing async functions
const asyncReducer = (
  result: Promise<unknown>,
  nextFunction: Function
): Promise<unknown> =>
  result.then((resolved: unknown): unknown => nextFunction(resolved))

// Takes a list of functions and returns a single function that applies them left to right
const pipe =
  (functions: Function[]) =>
  (initialArg: unknown): unknown =>
    functions.reduce(reducer, initialArg)

// Takes a list of async functions and returns a single function that applies them left to right
const asyncPipe =
  (functions: Function[]) =>
  (initialArg: unknown): Promise<unknown> =>
    functions.reduce(asyncReducer, Promise.resolve(initialArg))

// Takes a list of functions and returns a single function that applies them right to left
const compose =
  (functions: Function[]) =>
  (initialArg: unknown): unknown =>
    functions.reduceRight(reducer, initialArg)

// Takes a list of async functions and returns a single function that applies them right to left
const asyncCompose =
  (functions: Function[]) =>
  (initialArg: unknown): Promise<unknown> =>
    functions.reduceRight(asyncReducer, Promise.resolve(initialArg))

export { pipe, asyncPipe, compose, asyncCompose }
