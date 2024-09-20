// Define unique symbols to represent the type identifier for Task
const TASK_SYMBOL: unique symbol = Symbol('Task')

// Deferred is a function that returns a Promise of a value and never fails
type Deferred<T> = () => Promise<T>

// Task is a wrapper that represents a deferred action that will eventually happen
type Task<T> = Readonly<{
  type: typeof TASK_SYMBOL
  value: Deferred<T>
}>

// Constructor (also known as Pure or Return)
function Pure<T>(input: Deferred<T>): Task<T> {
  return Object.freeze({
    type: TASK_SYMBOL,
    value: input,
  })
}

// Mappings take any value and map them without a wrapping
type TaskMapping<T, U> = (input: T) => U

// Map the value that would be returned by the deferred task
function map<T, U>(mapping: TaskMapping<T, U>): (input: Task<T>) => Task<U> {
  return (input: Task<T>): Task<U> => Pure(() => input.value().then(mapping))
}

// Bindings take any value and map them with a wrapping
type TaskBinding<T, U> = (input: T) => Task<U>

// Binds to the value that would be returned by the deferred task
function bind<T, U>(mapping: TaskBinding<T, U>): (input: Task<T>) => Task<U> {
  return (input: Task<T>): Task<U> =>
    Pure(() => input.value().then((result: T) => mapping(result).value()))
}

// Perform the deferred task encapsulated in a Task.
function run<T>(input: Task<T>): Promise<T> {
  return input.value()
}

const task = {
  TASK_SYMBOL,
  Pure,
  map,
  bind,
  run,
}

export default task

export type { Task, Deferred, TaskMapping, TaskBinding }
