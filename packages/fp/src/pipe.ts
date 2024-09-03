const pipe = (functions: Function[]) => (initialArg: unknown) =>
  functions.reduce(
    (result, nextFunction): unknown => nextFunction(result),
    initialArg
  )

const asyncPipe = (functions: Function[]) => (initialArg: unknown) =>
  functions.reduce(
    (result, nextFunction) =>
      Promise.resolve(result).then((resolved: unknown): unknown =>
        nextFunction(resolved)
      ),
    initialArg
  )

export { pipe, asyncPipe }
