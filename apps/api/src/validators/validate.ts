import { validationResult } from 'express-validator'
import * as E from 'fp-ts/Either'
import type { Request } from 'express'
import type { ValidationError } from 'express-validator'

type ValidationResult = E.Either<ValidationError[], Request>

function validate(req: Request): ValidationResult {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // If validation fails, return ValidationError[] in either Left
    return E.left(errors.array())
  }

  // Else map request and return in either Right
  return E.right(req)
}

export default validate
