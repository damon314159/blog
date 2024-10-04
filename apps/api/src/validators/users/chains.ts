import { email, password, username } from './validators.js'
import type { ValidationChain } from 'express-validator'

export const createUserValidators: ValidationChain[] = [
  username(),
  password(),
  email(),
]
