import { either, ioTask, pipe } from '@blog/fp'
import { createUser, hashPassword } from '../services/user.js'
import type { Either, IO, IOTask, IOTaskBinding, Task } from '@blog/fp'

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

const createUserController = pipe(hashPassword, ioTaskEitherBind(createUser))
