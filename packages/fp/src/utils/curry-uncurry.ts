// Takes a function of two arguments, and converts it to a function of one argument that returns another function of one argument
// E.g. (x, y) => x+y becomes x => y => x+y
const curry =
  <A, B, Ret>(fn: (a: A, b: B) => Ret) =>
  (a: A) =>
  (b: B): Ret =>
    fn(a, b)

// Takes a curried function of two applications and converts to a single function of two arguments
// E.g. x => y => x+y becomes (x, y) => x+y
const unCurry =
  <A, B, Ret>(fn: (a: A) => (b: B) => Ret) =>
  (a: A, b: B): Ret =>
    fn(a)(b)

export { curry, unCurry }
