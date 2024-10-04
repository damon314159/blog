import { freeze } from '@blog/functional'
import { compare, hash } from 'bcryptjs'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// Take the createUserArgs, and return a task that hashes the password
const hashPassword = (
  args: CreateUserArgs
): TE.TaskEither<Error, Readonly<CreateUserArgs>> =>
  pipe(
    TE.tryCatch(() => hash(args.data.password, 12), E.toError),
    TE.map((hashed: string) =>
      freeze({ ...args, data: { ...args.data, password: hashed } })
    )
  )

// Return a task to perform the DB write
const createUser = (
  args: CreateUserArgs
): TE.TaskEither<Error, Readonly<User>> =>
  pipe(
    TE.tryCatch(() => prisma.user.create(args), E.toError),
    TE.map(freeze)
  )

export { hashPassword, createUser }
