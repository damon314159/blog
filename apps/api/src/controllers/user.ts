import { freeze } from '@blog/functional'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { createUser, hashPassword } from '../services/user.js'
import { sendResponse } from '../utils/send-response.js'
import validate from '../validators/validate.js'
import type { prisma } from '../bin/client.js'
import type { Prisma, User } from '@prisma/client'
import type { Request, Response } from 'express'

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

const getCreateUserResponseData = (user: User) => pipe({ user }, freeze)

const createUserController = (req: Request, res: Response): Promise<void> =>
  pipe(
    validate(req),
    E.map(extractCreateUserArgs),
    TE.fromEither,
    TE.flatMap(hashPassword),
    TE.flatMap(createUser),
    TE.map(getCreateUserResponseData),
    sendResponse({ error: 400, success: 201 })(res)
  )()

export { createUserController }
