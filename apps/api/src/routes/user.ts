import { Router } from 'express'
import { createUserController } from '../controllers/user.js'
import { createUserValidators } from '../validators/users/chains.js'

const router = Router()

router.post('/', createUserValidators, createUserController)

export default router
