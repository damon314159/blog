import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * This is an ESM replacement for `__filename`.
 *
 * Use it like this: `__filename(import.meta)`.
 */
// eslint-disable-next-line no-underscore-dangle
export const __filename = (meta: ImportMeta): string => fileURLToPath(meta.url)

/**
 * This is an ESM replacement for `__dirname`.
 *
 * Use it like this: `__dirname(import.meta)`.
 */
// eslint-disable-next-line no-underscore-dangle
export const __dirname = (meta: ImportMeta): string => dirname(__filename(meta))
