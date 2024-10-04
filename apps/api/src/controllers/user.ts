import { freeze } from '@blog/functional'
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { createUser, hashPassword } from '../services/user.js'
import validate from '../validators/validate.js'
import type { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'
import type { Request } from 'express'
import type { ValidationError } from 'express-validator'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

const extractCreateUserArgs = (
  req: Request<object, object, CreateUserArgs['data']>
): Readonly<CreateUserArgs> =>
  pipe(
    {
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    },
    freeze
  )

const createUserController: (
  req: Request
) => TE.TaskEither<ValidationError[] | Error, Readonly<User>> = flow(
  validate,
  E.map(extractCreateUserArgs),
  TE.fromEither,
  TE.flatMap(hashPassword),
  TE.flatMap(createUser),
  TE.map(freeze)
)

export { createUserController }
