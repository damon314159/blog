import { either, io, ioTask, pipe } from '@blog/fp'
import { createUser, hashPassword } from '../services/user.js'
import validate from '../validators/validate.js'
import type { prisma } from '../bin/client.js'
import type { Either, IO, IOTask, IOTaskBinding, Task } from '@blog/fp'
import type { Prisma } from '@prisma/client'
import type { Request } from 'express'
import type { ValidationError } from 'express-validator'

type CreateUserArgs = Prisma.Args<typeof prisma.user, 'create'>

// This is an unfortunate workaround to missing HKT in TS
const ioTaskEitherMap = <E, T, U>(callback: (input: T) => Either<E, U>) =>
  ioTask.map(either.match((error: E) => either.PureL(error), callback))

// This is an unfortunate workaround to missing HKT in TS
const ioTaskEitherBind = <E, T, U>(
  callback: (
    input: T
  ) => IO<Either<E, U>> | Task<Either<E, U>> | IOTask<Either<E, U>>
) =>
  ioTask.bind(
    either.match(
      (error: E) => ioTask.Pure(() => Promise.resolve(either.PureL(error))),
      callback
    ) as IOTaskBinding<Either<E, T>, Either<E, U>> // This is failure of TS inference
  )

const extractCreateUserArgs = (
  req: Request<object, object, CreateUserArgs['data']>
) =>
  Object.freeze({
    data: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    },
  })

const createUserController = pipe(
  ioTaskEitherMap<ValidationError[], Request, CreateUserArgs>(
    validate(extractCreateUserArgs)
  ),
  ioTaskEitherBind(hashPassword),
  ioTaskEitherBind(createUser),
  ioTask.run
)

const handler = (req: Request) =>
  createUserController(io.Pure(() => either.Pure(req)))

export { handler }
