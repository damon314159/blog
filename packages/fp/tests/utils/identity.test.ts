import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { identity } from '../../src/utils/identity.js'

describe('identity', () => {
  it('Should return its input', () => {
    const foo = {}
    const result = identity(foo)

    assert.strictEqual(result, foo)
  })

  it('Should not modify its input', () => {
    const foo = Object.freeze({ bar: 5 })
    const result = identity(foo)

    assert.strictEqual(result, foo)
    assert.strictEqual(result.bar, 5)
  })
})
