import { body } from 'express-validator'
import type { ValidationChain } from 'express-validator'

const id = (location = body, field = 'id'): ValidationChain =>
  location(field)
    .escape()
    .exists({ values: 'falsy' })
    .withMessage('ID must be provided')
    .isInt({ gt: 0 })
    .withMessage('ID must be an integer greater than 0')
const idOptional = (location = body, field = 'id'): ValidationChain =>
  id(location, field).optional()

const uuid = (location = body, field = 'uuid'): ValidationChain =>
  location(field)
    .escape()
    .exists({ values: 'falsy' })
    .withMessage('UUID must be provided')
    .isUUID()
    .withMessage('UUID must be a valid UUID')
const uuidOptional = (location = body, field = 'id'): ValidationChain =>
  uuid(location, field).optional()

export { id, idOptional, uuid, uuidOptional }
