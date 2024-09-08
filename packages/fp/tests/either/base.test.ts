import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import either from '../../src/either/base.js'
import type { Either } from '../../src/either/base.js'

describe('Pure', () => {
  it('should create a Right value', () => {
    const rightValue = either.Pure(42)
    assert.strictEqual(rightValue.type, either.RIGHT_SYMBOL)
    assert.strictEqual(rightValue.value, 42)
  })
})

describe('PureL', () => {
  it('should create a Left value', () => {
    const leftValue = either.PureL('Error')
    assert.strictEqual(leftValue.type, either.LEFT_SYMBOL)
    assert.strictEqual(leftValue.value, 'Error')
  })
})

describe('map', () => {
  it('should map over a Right value', () => {
    const rightValue = either.Pure(10)
    const double = (x: number) => x * 2
    const mapped = either.map((l) => l, double)(rightValue)
    assert.strictEqual(mapped.type, either.RIGHT_SYMBOL)
    assert.strictEqual(mapped.value, 20)
  })

  it('should map over a Left value', () => {
    const leftValue = either.PureL('Error')
    const mapLeft = (x: string) => `Handled ${x}`
    const mapped = either.map(mapLeft, (r) => r)(leftValue)
    assert.strictEqual(mapped.type, either.LEFT_SYMBOL)
    assert.strictEqual(mapped.value, 'Handled Error')
  })

  it('should handle different types when mapping', () => {
    const rightValue = either.Pure(100)
    const double = (x: number) => `Value: ${x * 2}`
    const mapped = either.map((l) => l, double)(rightValue)
    assert.strictEqual(mapped.type, either.RIGHT_SYMBOL)
    assert.strictEqual(mapped.value, 'Value: 200')
  })
})

describe('mapR', () => {
  it('should map only Right values, leaving Left unchanged', () => {
    const rightValue = either.Pure(10)
    const leftValue = either.PureL('Error')
    const square = (x: number) => x * x

    const mappedRight = either.mapR(square)(rightValue)
    assert.strictEqual(mappedRight.type, either.RIGHT_SYMBOL)
    assert.strictEqual(mappedRight.value, 100)

    const mappedLeft = either.mapR(square)(leftValue)
    assert.strictEqual(mappedLeft, leftValue)
  })
})

describe('mapL', () => {
  it('should map only Left values, leaving Right unchanged', () => {
    const rightValue = either.Pure(20)
    const leftValue = either.PureL('Error')
    const handle = (x: string) => `Handled ${x}`

    const mappedRight = either.mapL(handle)(rightValue)
    assert.strictEqual(mappedRight, rightValue)

    const mappedLeft = either.mapL(handle)(leftValue)
    assert.strictEqual(mappedLeft.type, either.LEFT_SYMBOL)
    assert.strictEqual(mappedLeft.value, 'Handled Error')
  })
})

describe('bind', () => {
  it('should bind over a Right value and return another Right', () => {
    const rightValue = either.Pure(5)
    const multiplyOrFail = (x: number): Either<string, number> =>
      x > 0 ? either.Pure(x * 3) : either.PureL('Negative')
    const bound = either.bind(
      (l) => either.PureL(l),
      multiplyOrFail
    )(rightValue)
    assert.strictEqual(bound.type, either.RIGHT_SYMBOL)
    assert.strictEqual(bound.value, 15)
  })

  it('should bind over a Left value and return another Left', () => {
    const leftValue = either.PureL('Initial Error')
    const handleError = (x: string) => either.PureL(`Handled: ${x}`)
    const bound = either.bind(handleError, (r) => either.Pure(r))(leftValue)
    assert.strictEqual(bound.type, either.LEFT_SYMBOL)
    assert.strictEqual(bound.value, 'Handled: Initial Error')
  })

  it('should return Left if the Right binding function returns Left', () => {
    const rightValue = either.Pure(0)
    const divide = (x: number): Either<string, number> =>
      x === 0 ? either.PureL('Cannot divide by zero') : either.Pure(10 / x)
    const bound = either.bind((l) => either.PureL(l), divide)(rightValue)
    assert.strictEqual(bound.type, either.LEFT_SYMBOL)
    assert.strictEqual(bound.value, 'Cannot divide by zero')
  })
})

describe('bindR', () => {
  it('should bind only Right values, leaving Left unchanged', () => {
    const rightValue = either.Pure(8)
    const leftValue = either.PureL('No operation')
    const toNegative = (x: number) => either.Pure(-x)

    const boundRight = either.bindR(toNegative)(rightValue)
    assert.strictEqual(boundRight.type, either.RIGHT_SYMBOL)
    assert.strictEqual(boundRight.value, -8)

    const boundLeft = either.bindR(toNegative)(leftValue)
    assert.strictEqual(boundLeft, leftValue)
  })
})

describe('bindL', () => {
  it('should bind only Left values, leaving Right unchanged', () => {
    const rightValue = either.Pure(7)
    const leftValue = either.PureL('Error')
    const handleError = (x: string) => either.PureL(`Handled ${x}`)

    const boundRight = either.bindL(handleError)(rightValue)
    assert.strictEqual(boundRight, rightValue)

    const boundLeft = either.bindL(handleError)(leftValue)
    assert.strictEqual(boundLeft.type, either.LEFT_SYMBOL)
    assert.strictEqual(boundLeft.value, 'Handled Error')
  })
})

describe('match', () => {
  it('should execute onLeft for Left', () => {
    const leftValue = either.PureL('Error')
    const onLeft = (x: string) => `Left value: ${x}`
    const onRight = (x: number) => `Right value: ${x}`
    const result = either.match(onLeft, onRight)(leftValue)
    assert.strictEqual(result, 'Left value: Error')
  })

  it('should execute onRight for Right', () => {
    const rightValue = either.Pure(12)
    const onLeft = (x: string) => `Left value: ${x}`
    const onRight = (x: number) => `Right value: ${x}`
    const result = either.match(onLeft, onRight)(rightValue)
    assert.strictEqual(result, 'Right value: 12')
  })

  it('should handle different types and nested Eithers', () => {
    const rightValue = either.Pure(either.PureL('Nested Error'))
    const onLeft = (x: string) => `Outer Left: ${x}`
    const onRight = (inner: Either<string, string>) =>
      either.match(
        (l: string) => `Inner Left: ${l}`,
        (r: string) => `Inner Right: ${r}`
      )(inner)

    const result = either.match(onLeft, onRight)(rightValue)
    assert.strictEqual(result, 'Inner Left: Nested Error')
  })

  it('should not execute onRight when input is Left', () => {
    const leftValue = either.PureL('Left value')
    const onLeft = (x: string) => `Handled ${x}`
    const onRight = () => {
      throw new Error('This should not be called')
    }
    const result = either.match(onLeft, onRight)(leftValue)
    assert.strictEqual(result, 'Handled Left value')
  })
})
