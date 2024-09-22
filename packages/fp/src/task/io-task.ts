import type { Task } from './base.js'
import type { IO } from '../io/base.js'

// Define unique symbols to represent the type identifier for IOTask
const IO_TASK_SYMBOL: unique symbol = Symbol('Task')

// Deferred action is a function that returns a Promise of a value, is impure, and never fails
type DeferredAction<T> = () => Promise<T>

// IOTask is a wrapper that represents a deferred impure action that will eventually happen
type IOTask<T> = Readonly<{
  type: typeof IO_TASK_SYMBOL
  value: DeferredAction<T>
}>

// Constructor (also known as Pure or Return)
function Pure<T>(input: DeferredAction<T>): IOTask<T> {
  return Object.freeze({
    type: IO_TASK_SYMBOL,
    value: input,
  })
}

// Mappings take any value and map them without a wrapping
type IOTaskMapping<T, U> = (input: T) => U

// Map the value that would be returned by the deferred task
function map<T, U>(
  mapping: IOTaskMapping<T, U>
): (input: IO<T> | Task<T> | IOTask<T>) => IOTask<U> {
  return (input: IO<T> | Task<T> | IOTask<T>): IOTask<U> =>
    Pure(() => Promise.resolve(input.value()).then(mapping))
}

// Bindings take any value and map them with a wrapping
type IOTaskBinding<T, U> = (input: T) => IO<U> | Task<U> | IOTask<U>

// Binds to the value that would be returned by the deferred task
function bind<T, U>(
  mapping: IOTaskBinding<T, U>
): (input: IO<T> | Task<T> | IOTask<T>) => IOTask<U> {
  return (input: IO<T> | Task<T> | IOTask<T>): IOTask<U> =>
    Pure(() =>
      Promise.resolve(input.value()).then((result: T) =>
        mapping(result).value()
      )
    )
}

// Perform the deferred task encapsulated in a Task.
function run<T>(input: IOTask<T>): Promise<T> {
  return input.value()
}

const ioTask = {
  IO_TASK_SYMBOL,
  Pure,
  map,
  bind,
  run,
}

export default ioTask

export type { IOTask, DeferredAction, IOTaskMapping, IOTaskBinding }
