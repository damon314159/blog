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

const result = await asyncPipe([
  (x: number) =>
    new Promise((res) => {
      setTimeout(() => {
        res(x * 2)
      }, 100)
    }),
  (x: number) =>
    new Promise((res) => {
      setTimeout(() => {
        res(x + 1)
      }, 100)
    }),
])(4)

console.log(result)
