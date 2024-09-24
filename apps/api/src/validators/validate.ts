import { validationResult } from 'express-validator'
import * as E from 'fp-ts/Either'
import type { Request } from 'express'
import type { ValidationError } from 'express-validator'

type ValidationResult<T> = E.Either<ValidationError[], T>
type RequestTo<T> = (req: Request) => T

function validate<T>(
  mapping: RequestTo<T>
): (req: Request) => ValidationResult<T> {
  return (req: Request) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // If validation fails, return ValidationError[] in either Left
      return E.left(errors.array())
    }

    // Else map request and return in either Right
    return E.right(mapping(req))
  }
}

export default validate
