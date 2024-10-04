import { freeze } from '@blog/functional'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { createUser, hashPassword } from '../services/user.js'
import validate from '../validators/validate.js'
import type { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'
import type { Request, Response } from 'express'
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

const sendCreateUserResponse = (res: Response) =>
  TE.match(
    (e: ValidationError[] | Error): void => {
      res.status(400).json({ errors: Array.isArray(e) ? e : [e] })
    },
    (user: User): void => {
      res.status(201).json({ user })
    }
  )

const createUserController = (req: Request, res: Response): Promise<void> =>
  pipe(
    validate(req),
    E.map(extractCreateUserArgs),
    TE.fromEither,
    TE.flatMap(hashPassword),
    TE.flatMap(createUser),
    TE.map(freeze),
    sendCreateUserResponse(res)
  )()

export { createUserController }
