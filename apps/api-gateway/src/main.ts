import 'reflect-metadata'

import { FotaLogger } from '@fota/logger'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from '@/app/app.module'
import { APPLICATION_NAME } from '@/constants'

const logger = new Logger(`${APPLICATION_NAME}`)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: {
      log: (msg: unknown, ctx?: string) => FotaLogger.log(msg, ctx),
      error: (msg: unknown, stack?: string, ctx?: string) => FotaLogger.error(msg, stack, ctx),
      warn: (msg: unknown, ctx?: string) => FotaLogger.warn(msg, ctx),
      debug: (msg: unknown, ctx?: string) => FotaLogger.debug(msg, ctx),
      verbose: (msg: unknown, ctx?: string) => FotaLogger.verbose(msg, ctx),
    },
  })
  const port = process.env['PORT'] ?? 3030

  await app.listen(port)
  return port
}

bootstrap().then((port) => {
  logger.log(`Server is running at http://localhost:${port}`)
}).catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  logger.error('Server failed to start up cleanly', errorMessage)
  process.exit(1)
})
