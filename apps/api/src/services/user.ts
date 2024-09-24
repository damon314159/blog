import { compare, hash } from 'bcryptjs'
import * as E from 'fp-ts/Either'
import { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'
import type * as TE from 'fp-ts/TaskEither'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// Take the createUserArgs, and return a task that hashes the password
const hashPassword =
  (args: CreateUserArgs): TE.TaskEither<Error, CreateUserArgs> =>
  () =>
    hash(args.data.password, 12).then(
      (hashed: string) =>
        E.right(
          Object.freeze({ ...args, data: { ...args.data, password: hashed } })
        ),
      (error: Error) => E.left(error)
    )

// Return a task to perform the DB write
const createUser =
  (args: CreateUserArgs): TE.TaskEither<Error, User> =>
  () =>
    prisma.user.create(args).then(
      (user: User) => E.right(Object.freeze(user)),
      (error: Error) => E.left(error)
    )

export { hashPassword, createUser }
