import { body } from 'express-validator'
import type { ValidationChain } from 'express-validator'

const username = (location = body, field = 'username'): ValidationChain =>
  location(field)
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username cannot be empty')
    .isLength({ max: 32 })
    .withMessage('Username must not exceed 32 characters')
const usernameOptional = (
  location = body,
  field = 'username'
): ValidationChain => username(location, field).optional()

const password = (location = body, field = 'password'): ValidationChain =>
  location(field)
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/)
    .withMessage(
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
const passwordOptional = (
  location = body,
  field = 'password'
): ValidationChain => password(location, field).optional()

const email = (location = body, field = 'email'): ValidationChain =>
  location(field)
    .isString()
    .withMessage('Email must be a string')
    .isEmail()
    .withMessage('Email must be a valid email address')
const emailOptional = (location = body, field = 'email'): ValidationChain =>
  email(location, field).optional()

export {
  username,
  usernameOptional,
  password,
  passwordOptional,
  email,
  emailOptional,
}
