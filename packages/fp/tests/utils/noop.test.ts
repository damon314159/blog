import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { noop } from '../../src/utils/noop.js'

describe('noop', () => {
  it('Should do nothing', () => {
    noop()
    assert.strictEqual(true, true)
  })
})
