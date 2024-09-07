import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { curry, unCurry } from '../../src/utils/curry-uncurry.js'

describe('curry', async () => {
  it('should curry a function of two arguments into a function of one argument returning another function', () => {
    const add = (x: number, y: number) => x + y
    const curriedAdd = curry(add)

    assert.strictEqual(typeof curriedAdd, 'function')
    assert.strictEqual(curriedAdd(1)(2), 3)
  })

  it('should work with different types', () => {
    const concat = (a: string, b: string) => a + b
    const curriedConcat = curry(concat)

    assert.strictEqual(curriedConcat('Hello, ')('World!'), 'Hello, World!')
  })

  it('should handle complex objects', () => {
    const merge = (a: object, b: object) => ({ ...a, ...b })
    const curriedMerge = curry(merge)

    assert.deepStrictEqual(curriedMerge({ foo: 'bar' })({ baz: 'qux' }), {
      foo: 'bar',
      baz: 'qux',
    })
  })

  it('should handle functions as arguments', () => {
    const apply = (fn: (x: number) => number, value: number) => fn(value)
    const curriedApply = curry(apply)

    const double = (x: number) => x * 2
    assert.strictEqual(curriedApply(double)(5), 10)
  })

  it('should handle nested function applications', () => {
    const multiplyAndApply = (a: number, b: (x: number) => number) => b(a)
    const curriedMultiplyAndApply = curry(multiplyAndApply)

    assert.strictEqual(
      curriedMultiplyAndApply(5)((x) => x * 3),
      15
    )
  })
})

describe('unCurry', () => {
  it('should un-curry a curried function of two applications into a single function of two arguments', () => {
    const curriedAdd = (x: number) => (y: number) => x + y
    const unCurriedAdd = unCurry(curriedAdd)

    assert.strictEqual(typeof unCurriedAdd, 'function')
    assert.strictEqual(unCurriedAdd(1, 2), 3)
  })

  it('should work with different types', () => {
    const curriedConcat = (a: string) => (b: string) => a + b
    const unCurriedConcat = unCurry(curriedConcat)

    assert.strictEqual(unCurriedConcat('Hello, ', 'World!'), 'Hello, World!')
  })

  it('should handle complex objects', () => {
    const curriedMerge = (a: object) => (b: object) => ({ ...a, ...b })
    const unCurriedMerge = unCurry(curriedMerge)

    assert.deepStrictEqual(unCurriedMerge({ foo: 'bar' }, { baz: 'qux' }), {
      foo: 'bar',
      baz: 'qux',
    })
  })

  it('should handle functions as arguments', () => {
    const curriedApply = (fn: (x: number) => number) => (value: number) =>
      fn(value)
    const unCurriedApply = unCurry(curriedApply)

    const triple = (x: number) => x * 3
    assert.strictEqual(unCurriedApply(triple, 4), 12)
  })

  it('should handle nested function applications', () => {
    const curriedTransform = (x: number) => (fn: (y: number) => number) => fn(x)
    const unCurriedTransform = unCurry(curriedTransform)

    assert.strictEqual(
      unCurriedTransform(3, (x) => x ** 2),
      9
    )
  })
})
