import { either, ioTask, task } from '@blog/fp'
import { compare, hash } from 'bcryptjs'
import { prisma } from '../bin/client.js'
import type { Either, IOTask, Task } from '@blog/fp'
import type { Prisma, User } from '@prisma/client'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// Take the createUserArgs, and return a task that hashes the password
const hashPassword = <E>(
  args: CreateUserArgs
): Task<Either<E, CreateUserArgs>> =>
  task.Pure(() =>
    hash(args.data.password, 12).then(
      (hashed: string) =>
        either.Pure(
          Object.freeze({ ...args, data: { ...args.data, password: hashed } })
        ),
      (error: E) => either.PureL(error)
    )
  )

// Return a task to perform the DB write
const createUser = <E>(args: CreateUserArgs): IOTask<Either<E, User>> =>
  ioTask.Pure(() =>
    prisma.user.create(args).then(
      (user: User) => either.Pure(Object.freeze(user)),
      (error: E) => either.PureL(error)
    )
  )

export { hashPassword, createUser }
