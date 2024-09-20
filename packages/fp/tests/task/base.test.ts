import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import task from '../../src/task/base.js'

describe('Task Pure', () => {
  it('encapsulates a deferred action returning a number', async () => {
    const action = () => Promise.resolve(42)
    const taskAction = task.Pure(action)
    const result = await task.run(taskAction)
    assert.equal(result, 42)
  })

  it('encapsulates a deferred action returning a string', async () => {
    const action = () => Promise.resolve('hello')
    const taskAction = task.Pure(action)
    const result = await task.run(taskAction)
    assert.equal(result, 'hello')
  })

  it('ensures action is deferred until run is called', async () => {
    let executed = false
    const action = () =>
      new Promise<number>((resolve) => {
        executed = true
        resolve(42)
      })
    const taskAction = task.Pure(action)
    assert.equal(executed, false)
    await task.run(taskAction)
    assert.equal(executed, true)
  })
})

describe('Task Map', () => {
  it('applies a function to the result of a deferred action', async () => {
    const action = () => Promise.resolve(10)
    const taskAction = task.Pure(action)
    const mappedAction = task.map((x: number) => x * 2)(taskAction)
    const result = await task.run(mappedAction)
    assert.equal(result, 20)
  })

  it('applies a function to the result of a deferred action returning a string', async () => {
    const action = () => Promise.resolve('Functional')
    const taskAction = task.Pure(action)
    const mappedAction = task.map((x: string) => `${x} Programming`)(taskAction)
    const result = await task.run(mappedAction)
    assert.equal(result, 'Functional Programming')
  })

  it('handles multiple maps sequentially', async () => {
    const action = () => Promise.resolve(5)
    const taskAction = task.Pure(action)
    const mappedAction0 = task.map((x: number) => x + 2)(taskAction)
    const mappedAction1 = task.map((x: number) => x * 3)(mappedAction0)
    const mappedAction2 = task.map((x: number) => x.toString(2))(mappedAction1)
    const result = await task.run(mappedAction2)
    assert.equal(result, '10101')
  })

  it('ensures mapped action is deferred until run is called', async () => {
    let executed = false
    const action = () =>
      new Promise<number>((resolve) => {
        executed = true
        resolve(10)
      })
    const taskAction = task.Pure(action)
    const mappedAction = task.map((x: number) => x * 2)(taskAction)
    assert.equal(executed, false)
    await task.run(mappedAction)
    assert.equal(executed, true)
  })
})

describe('Task Bind', () => {
  it('chains deferred actions', async () => {
    const action = () => Promise.resolve(5)
    const binding = (x: number) => task.Pure(() => Promise.resolve(x * 3))

    const taskAction = task.Pure(action)
    const boundAction = task.bind(binding)(taskAction)
    const result = await task.run(boundAction)
    assert.equal(result, 15)
  })

  it('chains deferred actions returning a string', async () => {
    const action = () => Promise.resolve('hello')
    const binding = (x: string) =>
      task.Pure(() => Promise.resolve(`${x} world`))

    const taskAction = task.Pure(action)
    const boundAction = task.bind(binding)(taskAction)
    const result = await task.run(boundAction)
    assert.equal(result, 'hello world')
  })

  it('chains multiple binds in sequence', async () => {
    const action = () => Promise.resolve('start')
    const binding0 = (x: string) =>
      task.Pure(() => Promise.resolve(`${x} middle`))
    const binding1 = (x: string) => task.Pure(() => Promise.resolve(`${x} end`))

    const taskAction = task.Pure(action)
    const boundAction0 = task.bind(binding0)(taskAction)
    const boundAction1 = task.bind(binding1)(boundAction0)
    const result = await task.run(boundAction1)
    assert.equal(result, 'start middle end')
  })

  it('ensures chained actions are deferred until run is called', async () => {
    let executed1 = false
    let executed2 = false

    const action = () =>
      new Promise<number>((resolve) => {
        executed1 = true
        resolve(5)
      })
    const binding = (x: number) =>
      task.Pure(
        () =>
          new Promise<number>((resolve) => {
            executed2 = true
            resolve(x * 3)
          })
      )

    const taskAction = task.Pure(action)
    const boundAction = task.bind(binding)(taskAction)

    assert.equal(executed1, false)
    assert.equal(executed2, false)

    await task.run(boundAction)

    assert.equal(executed1, true)
    assert.equal(executed2, true)
  })
})

describe('Task Run', () => {
  it('executes the encapsulated deferred action returning a number', async () => {
    const action = () => Promise.resolve(99)
    const taskAction = task.Pure(action)
    const result = await task.run(taskAction)
    assert.equal(result, 99)
  })

  it('executes the encapsulated deferred action returning a string', async () => {
    const action = () => Promise.resolve('Running')
    const taskAction = task.Pure(action)
    const result = await task.run(taskAction)
    assert.equal(result, 'Running')
  })
})
