import 'reflect-metadata'

import { FotaLogger } from '@fota/logger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@/app/app.module'
import { APPLICATION_NAME } from '@/constants'

// Destructure environment variables safely
const { API_NAME, API_DESCRIPTION, API_VERSION, API_PREFIX, PORT, API_URL } = process.env

const globalPrefix = API_PREFIX as string
const port = parseInt(PORT as string, 10) || 3030
const apiName = API_NAME as string
const apiDescription = API_DESCRIPTION as string
const apiVersion = API_VERSION as string
const server = API_URL as string

const logger = new Logger(`${APPLICATION_NAME}`)

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: {
      log: (msg: unknown, ctx?: string) => FotaLogger.log(msg, ctx),
      error: (msg: unknown, stack?: string, ctx?: string) => FotaLogger.error(msg, stack, ctx),
      warn: (msg: unknown, ctx?: string) => FotaLogger.warn(msg, ctx),
      debug: (msg: unknown, ctx?: string) => FotaLogger.debug(msg, ctx),
      verbose: (msg: unknown, ctx?: string) => FotaLogger.verbose(msg, ctx),
    },
  })

  // Enable explicit API security practices
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Gracefully handles container shutdown processes (K8s / PM2 / Docker)
  app.enableShutdownHooks()

  app.setGlobalPrefix(globalPrefix, {
    exclude: ['/', '/health'],
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(apiDescription)
    .setVersion(apiVersion)
    .addServer(
      server,
      apiName,
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  const swaggerPath = `${globalPrefix}/docs`
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(port)
  return port
}

bootstrap()
  .then((port) => {
    logger.log(`Server is running at: http://localhost:${port}`)
    logger.log(`API Documentation available at: http://localhost:${port}/${globalPrefix}/docs`)
    logger.log(`API endpoints running at: http://localhost:${port}/${globalPrefix}`)
    logger.log(`API version: ${apiVersion}`)
  })
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error('Server failed to start up cleanly', errorMessage)
    process.exit(1)
  })
