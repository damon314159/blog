import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import ioTask from '../../src/task/io-task.js'

describe('IOTask Pure', () => {
  it('encapsulates a deferred action returning a number', async () => {
    const action = () => Promise.resolve(42)
    const taskAction = ioTask.Pure(action)
    const result = await ioTask.run(taskAction)
    assert.equal(result, 42)
  })

  it('encapsulates a deferred action returning a string', async () => {
    const action = () => Promise.resolve('hello')
    const taskAction = ioTask.Pure(action)
    const result = await ioTask.run(taskAction)
    assert.equal(result, 'hello')
  })

  it('ensures action is deferred until run is called', async () => {
    let executed = false
    const action = () =>
      new Promise<number>((resolve) => {
        executed = true
        resolve(42)
      })
    const taskAction = ioTask.Pure(action)
    assert.equal(executed, false)
    await ioTask.run(taskAction)
    assert.equal(executed, true)
  })
})

describe('IOTask Map', () => {
  it('applies a function to the result of a deferred action', async () => {
    const action = () => Promise.resolve(10)
    const taskAction = ioTask.Pure(action)
    const mappedAction = ioTask.map((x: number) => x * 2)(taskAction)
    const result = await ioTask.run(mappedAction)
    assert.equal(result, 20)
  })

  it('applies a function to the result of a deferred action returning a string', async () => {
    const action = () => Promise.resolve('Functional')
    const taskAction = ioTask.Pure(action)
    const mappedAction = ioTask.map((x: string) => `${x} Programming`)(
      taskAction
    )
    const result = await ioTask.run(mappedAction)
    assert.equal(result, 'Functional Programming')
  })

  it('handles multiple maps sequentially', async () => {
    const action = () => Promise.resolve(5)
    const taskAction = ioTask.Pure(action)
    const mappedAction0 = ioTask.map((x: number) => x + 2)(taskAction)
    const mappedAction1 = ioTask.map((x: number) => x * 3)(mappedAction0)
    const mappedAction2 = ioTask.map((x: number) => x.toString(2))(
      mappedAction1
    )
    const result = await ioTask.run(mappedAction2)
    assert.equal(result, '10101')
  })

  it('ensures mapped action is deferred until run is called', async () => {
    let executed = false
    const action = () =>
      new Promise<number>((resolve) => {
        executed = true
        resolve(10)
      })
    const taskAction = ioTask.Pure(action)
    const mappedAction = ioTask.map((x: number) => x * 2)(taskAction)
    assert.equal(executed, false)
    await ioTask.run(mappedAction)
    assert.equal(executed, true)
  })
})

describe('IOTask Bind', () => {
  it('chains deferred actions', async () => {
    const action = () => Promise.resolve(5)
    const binding = (x: number) => ioTask.Pure(() => Promise.resolve(x * 3))

    const taskAction = ioTask.Pure(action)
    const boundAction = ioTask.bind(binding)(taskAction)
    const result = await ioTask.run(boundAction)
    assert.equal(result, 15)
  })

  it('chains deferred actions returning a string', async () => {
    const action = () => Promise.resolve('hello')
    const binding = (x: string) =>
      ioTask.Pure(() => Promise.resolve(`${x} world`))

    const taskAction = ioTask.Pure(action)
    const boundAction = ioTask.bind(binding)(taskAction)
    const result = await ioTask.run(boundAction)
    assert.equal(result, 'hello world')
  })

  it('chains multiple binds in sequence', async () => {
    const action = () => Promise.resolve('start')
    const binding0 = (x: string) =>
      ioTask.Pure(() => Promise.resolve(`${x} middle`))
    const binding1 = (x: string) =>
      ioTask.Pure(() => Promise.resolve(`${x} end`))

    const taskAction = ioTask.Pure(action)
    const boundAction0 = ioTask.bind(binding0)(taskAction)
    const boundAction1 = ioTask.bind(binding1)(boundAction0)
    const result = await ioTask.run(boundAction1)
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
      ioTask.Pure(
        () =>
          new Promise<number>((resolve) => {
            executed2 = true
            resolve(x * 3)
          })
      )

    const taskAction = ioTask.Pure(action)
    const boundAction = ioTask.bind(binding)(taskAction)

    assert.equal(executed1, false)
    assert.equal(executed2, false)

    await ioTask.run(boundAction)

    assert.equal(executed1, true)
    assert.equal(executed2, true)
  })
})

describe('IOTask Run', () => {
  it('executes the encapsulated deferred action returning a number', async () => {
    const action = () => Promise.resolve(99)
    const taskAction = ioTask.Pure(action)
    const result = await ioTask.run(taskAction)
    assert.equal(result, 99)
  })

  it('executes the encapsulated deferred action returning a string', async () => {
    const action = () => Promise.resolve('Running')
    const taskAction = ioTask.Pure(action)
    const result = await ioTask.run(taskAction)
    assert.equal(result, 'Running')
  })
})
