import { FotaLogger } from '@fota/logger'

export default defineEventHandler(async (event) => {
  // Only allow this endpoint to run in development
  if (process.env.NODE_ENV !== 'development') {
    return { success: false }
  }

  const { level, message, context, stack } = await readBody(event)

  // Instantiate the logger on the server and print it directly to the terminal!
  const serverLogger = new FotaLogger(context)

  if (level === 'error') {
    serverLogger.error(message, stack)
  }
  else if (level === 'warn') {
    serverLogger.warn(message)
  }
  else if (level === 'info') {
    serverLogger.info(message)
  }
  else if (level === 'debug') {
    serverLogger.debug(message)
  }
  else if (level === 'verbose') {
    serverLogger.verbose(message)
  }
  else {
    serverLogger.log(message)
  }

  return { success: true }
})
