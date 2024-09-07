import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { compose, pipe } from '../../src/utils/pipe-compose.js'

describe('pipe', () => {
  it('should apply functions from left to right', () => {
    const addOne = (x: number) => x + 1
    const double = (x: number) => x * 2
    const subtract = (x: number) => x - 3
    const piped = pipe(addOne, double, subtract)

    assert.strictEqual(piped(5), 9)
  })

  it('should handle a single function', () => {
    const identity = (x: number) => x
    const piped = pipe(identity)

    assert.strictEqual(piped(10), 10)
  })

  it('should handle an empty pipe', () => {
    const piped = pipe()
    assert.strictEqual(piped(42), 42)
  })

  it('should work with non-number types', () => {
    const toUpper = (str: string) => str.toUpperCase()
    const exclaim = (str: string) => `${str}!`
    const piped = pipe(toUpper, exclaim)

    assert.strictEqual(piped('hello'), 'HELLO!')
  })

  it('should handle functions that return other functions', () => {
    const add = (x: number) => (y: number) => x + y
    const double = (f: (x: number) => number) => f(5) * 2
    const piped = pipe(add, double)

    assert.strictEqual(piped(10), 30)
  })
})

describe('compose', () => {
  it('should apply functions from right to left', () => {
    const addOne = (x: number) => x + 1
    const double = (x: number) => x * 2
    const subtract = (x: number) => x - 3
    const composed = compose(subtract, double, addOne)

    assert.strictEqual(composed(5), 9)
  })

  it('should handle a single function', () => {
    const identity = (x: number) => x
    const composed = compose(identity)

    assert.strictEqual(composed(10), 10)
  })

  it('should handle an empty compose', () => {
    const composed = compose()
    assert.strictEqual(composed(42), 42)
  })

  it('should work with non-number types', () => {
    const toUpper = (str: string) => str.toUpperCase()
    const exclaim = (str: string) => `${str}!`
    const composed = compose(exclaim, toUpper)

    assert.strictEqual(composed('hello'), 'HELLO!')
  })

  it('should handle functions that return other functions', () => {
    const add = (x: number) => (y: number) => x + y
    const double = (f: (x: number) => number) => f(5) * 2
    const composed = compose(double, add)

    assert.strictEqual(composed(10), 30)
  })
})
