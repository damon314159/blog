import { compare, hash } from 'bcryptjs'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// Take the createUserArgs, and return a task that hashes the password
const hashPassword = (
  args: CreateUserArgs
): TE.TaskEither<Error, CreateUserArgs> =>
  TE.tryCatch(
    () =>
      hash(args.data.password, 12).then((hashed: string) =>
        Object.freeze({ ...args, data: { ...args.data, password: hashed } })
      ),
    E.toError
  )

// Return a task to perform the DB write
const createUser = (args: CreateUserArgs): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    () =>
      prisma.user
        .create(args)
        .then(Object.freeze as (user: User) => Readonly<User>),
    E.toError
  )

export { hashPassword, createUser }
