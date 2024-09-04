/*
 * A simple unary memoisation helper. Best suited to functions taking primitive arguments.
 * This is due to the potential leak of storing many object keys in Map objects.
 * WeakMap cannot take primitives, so does not fit either.
 * This isn't really an issue in an immutable functional paradigm, since most objects are quickly discarded
 */
const memo = <Arg, Ret>(fn: (arg: Arg) => Ret): ((arg: Arg) => Ret) => {
  const lookup = new Map<Arg, Ret>()

  return (arg: Arg): Ret => {
    if (lookup.has(arg)) {
      return lookup.get(arg)!
    }

    const result: Ret = fn(arg)
    lookup.set(arg, result)
    return result
  }
}

export { memo }
