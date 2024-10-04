import { resolve } from 'node:path'
import { __dirname } from '@blog/utils'
import cookieParser from 'cookie-parser'
import express, { type Application } from 'express'
import 'express-async-handler'
import helmet from 'helmet'
import methodOverride from 'method-override'
import logger from 'morgan'
import userRouter from './routes/user.js'

const app: Application = express()

// Initialise helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      // Define as strict CSP rules as possible where the defaults are relaxed
      directives: {
        'font-src': ["'self'"],
        'img-src': ["'self'"],
        'style-src': ["'self'"],
        'style-src-elem': ["'self'"],
        ...(process.env.LOCALHOST === 'true'
          ? // Stop webkit/safari asking for https assets on an http localhost
            { upgradeInsecureRequests: null }
          : // Otherwise, don't set the option
            {}),
      },
      useDefaults: true,
    },
  })
)

app.use(methodOverride('_method'))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// Configure express to search for assets in public
app.use(express.static(resolve(__dirname(import.meta), 'public')))

// Routes
app.use('/users', userRouter)

export default app
