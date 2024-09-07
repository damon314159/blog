import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import maybe from '../../src/maybe/base.js'
import type { Maybe } from '../../src/maybe/base.js'

describe('Pure', () => {
  it('should create a Just value', () => {
    const justValue = maybe.Pure(42)
    assert.strictEqual(justValue.value, 42)
  })
})

describe('map', () => {
  it('should map over a Just value', () => {
    const justValue = maybe.Pure(10)
    const addFive = (x: number) => x + 5
    const mapped = maybe.map(addFive)(justValue)
    // @ts-expect-error Allow unsafe read for testing
    assert.strictEqual(mapped.value, 15)
  })

  it('should return None when mapping over None', () => {
    const addFive = (x: number) => x + 5
    const mapped = maybe.map(addFive)(maybe.None)
    assert.strictEqual(mapped, maybe.None)
  })

  it('should map over a Just value to a different type', () => {
    const justValue = maybe.Pure(10)
    const numberToString = (x: number) => x.toString()
    const mapped = maybe.map(numberToString)(justValue)
    // @ts-expect-error Allow unsafe read for testing
    assert.strictEqual(mapped.value, '10')
  })

  it('should not call function when executed on None', () => {
    const throwIfCalled = () => {
      throw new Error('This should not be called')
    }
    const mapped = maybe.map(throwIfCalled)(maybe.None)
    assert.strictEqual(mapped, maybe.None)
  })
})

describe('bind', () => {
  it('should bind over a Just value and return another Just', () => {
    const justValue = maybe.Pure(20)
    const halfIfEven = (x: number) =>
      x % 2 === 0 ? maybe.Pure(x / 2) : maybe.None
    const bound = maybe.bind(halfIfEven)(justValue)
    // @ts-expect-error Allow unsafe read for testing
    assert.strictEqual(bound.value, 10)
  })

  it('should return None when binding over None', () => {
    const plus1 = (x: number) => maybe.Pure(x + 1)
    const bound = maybe.bind(plus1)(maybe.None)
    assert.strictEqual(bound, maybe.None)
  })

  it('should bind to None if the binding function returns None', () => {
    const justValue = maybe.Pure(3)
    const noneIfOdd = (x: number) =>
      x % 2 === 0 ? maybe.Pure(x * 2) : maybe.None
    const bound = maybe.bind(noneIfOdd)(justValue)
    assert.strictEqual(bound, maybe.None)
  })

  it('should handle chaining multiple binds', () => {
    const justValue = maybe.Pure(4)
    const addOne = (x: number) => maybe.Pure(x + 1)
    const double = (x: number) => maybe.Pure(x * 2)

    const chained = maybe.bind(addOne)(maybe.bind(double)(justValue))
    // @ts-expect-error Allow unsafe read for testing
    assert.strictEqual(chained.value, 9)
  })
})

describe('match', () => {
  it('should execute onNone for None', () => {
    const onNone = () => 'No value'
    const onJust = (x: number) => `Value: ${x}`
    const result = maybe.match(onNone, onJust)(maybe.None)
    assert.strictEqual(result, 'No value')
  })

  it('should execute onJust for Just', () => {
    const onNone = () => 'No value'
    const onJust = (x: number) => `Value: ${x}`
    const justValue = maybe.Pure(5)
    const result = maybe.match(onNone, onJust)(justValue)
    assert.strictEqual(result, 'Value: 5')
  })

  it('should handle Just values of different types', () => {
    const justValue = maybe.Pure('test')
    const onNone = () => 'None'
    const onJust = (x: string) => `Got: ${x}`
    const result = maybe.match(onNone, onJust)(justValue)
    assert.strictEqual(result, 'Got: test')
  })

  it('should handle nested maybe values', () => {
    const justValue = maybe.Pure(maybe.Pure(10))
    const onNone = () => 'Outer None'
    const onJust = (inner: Maybe<number>) =>
      maybe.match(
        () => 'Inner None',
        (x: number) => `Inner Just: ${x}`
      )(inner)
    const result = maybe.match(onNone, onJust)(justValue)
    assert.strictEqual(result, 'Inner Just: 10')
  })

  it('should not execute onJust when input is None', () => {
    const onNone = () => 'No value'
    const onJust = () => {
      throw new Error('This should not be called')
    }
    const result = maybe.match(onNone, onJust)(maybe.None)
    assert.strictEqual(result, 'No value')
  })

  it('should not execute onNone when input is Just', () => {
    const onNone = () => {
      throw new Error('This should not be called')
    }
    const onJust = (x: boolean) => !x
    const result = maybe.match(onNone, onJust)(maybe.Pure(false))
    assert.strictEqual(result, true)
  })
})
