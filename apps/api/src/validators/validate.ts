import { either } from '@blog/fp'
import { validationResult } from 'express-validator'
import type { Either } from '@blog/fp'
import type { Request } from 'express'
import type { ValidationError } from 'express-validator'

type ValidationResult<T> = Either<ValidationError[], T>
type RequestTo<T> = (req: Request) => T

function validate<T>(
  mapping: RequestTo<T>
): (req: Request) => ValidationResult<T> {
  return (req: Request) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // If validation fails, return ValidationError[] in either Left
      return either.PureL(errors.array())
    }

    // Else map request and return in either Right
    return either.Pure(mapping(req))
  }
}

export default validate
