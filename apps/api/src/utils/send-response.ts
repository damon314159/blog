import { flow } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import type { Response } from 'express'
import type { ValidationError } from 'express-validator'
import type * as IO from 'fp-ts/IO'

export const sendErrorResponse =
  (statusCode: number) =>
  (res: Response) =>
  (e: ValidationError[] | Error[] | Error): IO.IO<void> =>
  () => {
    res.status(statusCode).json({ errors: Array.isArray(e) ? e : [e] })
  }

export const sendSuccessResponse =
  (statusCode: number) =>
  (res: Response) =>
  (data: unknown): IO.IO<void> =>
  () => {
    res.status(statusCode).json(data)
  }

export const sendResponse =
  (statusCodes: { error: number; success: number }) => (res: Response) =>
    TE.matchE(
      flow(sendErrorResponse(statusCodes.error)(res), T.fromIO),
      flow(sendSuccessResponse(statusCodes.success)(res), T.fromIO)
    )
