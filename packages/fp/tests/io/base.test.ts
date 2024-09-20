import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import io from '../../src/io/base.js'

describe('IO Pure', () => {
  it('encapsulates an impure action returning a number', () => {
    const action = () => 42
    const ioAction = io.Pure(action)
    assert.equal(io.run(ioAction), 42)
  })

  it('encapsulates an impure action returning a string', () => {
    const action = () => 'hello'
    const ioAction = io.Pure(action)
    assert.equal(io.run(ioAction), 'hello')
  })

  it('ensures action is deferred until run is called', () => {
    let executed = false
    const action = () => {
      executed = true
      return 42
    }
    const ioAction = io.Pure(action)
    assert.equal(executed, false)
    io.run(ioAction)
    assert.equal(executed, true)
  })
})

describe('IO Map', () => {
  it('applies a function to the result of an impure action', () => {
    const action = () => 10
    const ioAction = io.Pure(action)
    const mappedAction = io.map((x: number) => x * 2)(ioAction)
    assert.equal(io.run(mappedAction), 20)
  })

  it('applies a function to the result of an impure action returning a string', () => {
    const action = () => 'Functional'
    const ioAction = io.Pure(action)
    const mappedAction = io.map((x: string) => `${x} Programming`)(ioAction)
    assert.equal(io.run(mappedAction), 'Functional Programming')
  })

  it('handles identity function correctly', () => {
    const action = () => 100
    const ioAction = io.Pure(action)
    const mappedAction = io.map((x: number) => x)(ioAction)
    assert.equal(io.run(mappedAction), 100)
  })

  it('handles multiple maps sequentially', () => {
    const action = () => 5
    const ioAction = io.Pure(action)
    const mappedAction0 = io.map((x: number) => x + 2)(ioAction)
    const mappedAction1 = io.map((x: number) => x * 3)(mappedAction0)
    const mappedAction2 = io.map((x: number) => x.toString(2))(mappedAction1)

    assert.equal(io.run(mappedAction2), '10101')
  })

  it('ensures mapped action is deferred until run is called', () => {
    let executed = false
    const action = () => {
      executed = true
      return 10
    }
    const ioAction = io.Pure(action)
    const mappedAction = io.map((x: number) => x * 2)(ioAction)
    assert.equal(executed, false)
    io.run(mappedAction)
    assert.equal(executed, true)
  })
})

describe('IO Bind', () => {
  it('chains impure actions', () => {
    const action1 = () => 5
    const action2 = (x: number) => io.Pure(() => x * 3)

    const ioAction = io.Pure(action1)
    const boundAction = io.bind(action2)(ioAction)

    assert.equal(io.run(boundAction), 15)
  })

  it('chains impure actions returning a string', () => {
    const action1 = () => 'hello'
    const action2 = (x: string) => io.Pure(() => `${x} world`)

    const ioAction = io.Pure(action1)
    const boundAction = io.bind(action2)(ioAction)

    assert.equal(io.run(boundAction), 'hello world')
  })

  it('chains multiple binds in sequence', () => {
    const action1 = () => 'start'
    const action2 = (x: string) => io.Pure(() => `${x} middle`)
    const action3 = (x: string) => io.Pure(() => `${x} end`)

    const ioAction = io.Pure(action1)
    const boundAction0 = io.bind(action2)(ioAction)
    const boundAction1 = io.bind(action3)(boundAction0)

    assert.equal(io.run(boundAction1), 'start middle end')
  })

  it('ensures chained actions are deferred until run is called', () => {
    let executed1 = false
    let executed2 = false

    const action1 = () => {
      executed1 = true
      return 5
    }
    const action2 = (x: number) => {
      executed2 = true
      return io.Pure(() => x * 3)
    }

    const ioAction = io.Pure(action1)
    const boundAction = io.bind(action2)(ioAction)

    assert.equal(executed1, false)
    assert.equal(executed2, false)

    io.run(boundAction)

    assert.equal(executed1, true)
    assert.equal(executed2, true)
  })
})

describe('IO Run', () => {
  it('executes the encapsulated impure action returning a number', () => {
    const action = () => 99
    const ioAction = io.Pure(action)
    assert.equal(io.run(ioAction), 99)
  })

  it('executes the encapsulated impure action returning a string', () => {
    const action = () => 'Running'
    const ioAction = io.Pure(action)
    assert.equal(io.run(ioAction), 'Running')
  })

  it('executes a complex encapsulated impure action', () => {
    const action = () => [1, 2, 3].map((x) => x * 2)
    const ioAction = io.Pure(action)
    assert.deepEqual(io.run(ioAction), [2, 4, 6])
  })
})
