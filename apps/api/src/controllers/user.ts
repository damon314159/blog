import { either, ioTask, pipe, task } from '@blog/fp'
import { compare, hash } from 'bcryptjs'
import { prisma } from '../bin/client.js'
import type { Either, IO, IOTask, IOTaskBinding, Task } from '@blog/fp'
import type { Prisma, User } from '@prisma/client'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// This is an unfortunate workaround to missing HKT in TS
const ioTaskEitherBind = <T, U>(
  callback: (
    input: T
  ) => IO<Either<Error, U>> | Task<Either<Error, U>> | IOTask<Either<Error, U>>
) =>
  ioTask.bind(
    either.match(
      (error: Error) => ioTask.Pure(() => Promise.resolve(either.PureL(error))),
      callback
    ) as IOTaskBinding<Either<Error, T>, Either<Error, U>> // This is failure of TS inference
  )

const hashPassword: (
  args: CreateUserArgs
) => Task<Either<Error, CreateUserArgs>> = (args) =>
  task.Pure(() =>
    hash(args.data.password, 12).then(
      (hashed: string) =>
        either.Pure(
          Object.freeze({ ...args, data: { ...args.data, password: hashed } })
        ),
      (error: Error) => either.PureL(error)
    )
  )

const createUser: (args: CreateUserArgs) => IOTask<Either<Error, User>> = (
  args
) =>
  ioTask.Pure(() =>
    prisma.user.create(args).then(
      (user: User) => either.Pure(Object.freeze(user)),
      (error: Error) => either.PureL(error)
    )
  )

const createUserController = pipe(hashPassword, ioTaskEitherBind(createUser))
