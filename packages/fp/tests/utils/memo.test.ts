import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { memo } from '../../src/utils/memo.js'

describe('memo', () => {
  it('should return the correct result for primitive arguments', () => {
    const addOne = (x: number) => x + 1
    const memoizedAddOne = memo(addOne)

    assert.strictEqual(memoizedAddOne(1), 2)
    assert.strictEqual(memoizedAddOne(2), 3)
  })

  it('should cache results and not call the function again for the same argument', () => {
    let callCount = 0
    const addOne = (x: number) => {
      callCount += 1
      return x + 1
    }
    const memoizedAddOne = memo(addOne)

    memoizedAddOne(5)
    memoizedAddOne(5)
    assert.strictEqual(callCount, 1)
  })

  it('should handle string arguments correctly', () => {
    const toUpperCase = (str: string) => str.toUpperCase()
    const memoizedToUpperCase = memo(toUpperCase)

    assert.strictEqual(memoizedToUpperCase('hello'), 'HELLO')
    assert.strictEqual(memoizedToUpperCase('world'), 'WORLD')
  })

  it('should return the same result for multiple identical calls', () => {
    const multiplyByTwo = (x: number) => x * 2
    const memoizedMultiplyByTwo = memo(multiplyByTwo)

    assert.strictEqual(memoizedMultiplyByTwo(10), 20)
    assert.strictEqual(memoizedMultiplyByTwo(10), 20)
  })

  it('should not cache different objects even with identical contents', () => {
    const getObjectKey = (obj: { key: string }) => obj.key
    const memoizedGetObjectKey = memo(getObjectKey)

    const obj1 = { key: 'value' }
    const obj2 = { key: 'value' }

    assert.strictEqual(memoizedGetObjectKey(obj1), 'value')
    assert.strictEqual(memoizedGetObjectKey(obj2), 'value')
    assert.notStrictEqual(obj1, obj2)
  })

  it('should handle boolean arguments correctly', () => {
    const negate = (bool: boolean) => !bool
    const memoizedNegate = memo(negate)

    assert.strictEqual(memoizedNegate(true), false)
    assert.strictEqual(memoizedNegate(false), true)
  })

  it('should work with functions as arguments', () => {
    const memoizedRunFunction = memo((fn: () => void) => {
      fn()
    })

    let callCount = 0
    const increment = () => {
      callCount += 1
    }

    memoizedRunFunction(increment)
    memoizedRunFunction(increment)

    assert.strictEqual(callCount, 1)
  })
})
