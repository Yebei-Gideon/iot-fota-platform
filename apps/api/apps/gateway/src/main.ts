import { FotaLogger } from '@fota/logger'
import { SERVICES } from '@fota-api/common'
import { GatewayModule } from '@fota-api/gateway/gateway.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json, urlencoded } from 'express'

// Use a single FotaLogger instance configured with the Gateway service context
const logger = new FotaLogger(SERVICES.GATEWAY.name)
logger.log(logger)
// tests
// log complex object
logger.log({ message: 'Test log', data: { key: 'value' } }, 'TestContext')
// log simple string
logger.info('Test info message', 'TestContext')
// log error with stack trace
logger.error(new Error('Test error'), 'TestContext')
// log warning
logger.warn('Test warning', 'TestContext')
// log debug message
logger.debug('Test debug message', 'TestContext')
// log verbose message
logger.verbose('Test verbose message', 'TestContext')
// log with additional parameters
logger.log('Test log with additional params', 'TestContext', { param1: 'value1' }, [1, 2, 3])

// log with context as a class constructor
class TestClass {
}

logger.info('Test info with class context', TestClass.name)
// log with template literal message
const userId = 123
logger.debug(`User ID is ${userId}`, 'TestContext')

async function bootstrap(): Promise<number> {
  const app = await NestFactory.create<NestExpressApplication>(
    GatewayModule,
    {
      // Pass the instance directly to handle startup logs
      logger,
    },
  )
  // Register logger globally so all NestJS modules/resolvers use it
  app.useLogger(logger)

  // Read configurations directly using NestJS ConfigService
  const configService = app.get(ConfigService)

  const globalPrefix = configService.get<string>('GLOBAL_PREFIX', 'api')
  const apiName = configService.get<string>(
    'API_NAME',
    'IoT FOTA Platform API',
  )
  const apiDescription = configService.get<string>(
    'API_DESCRIPTION',
    'API for the IoT FOTA Platform',
  )
  const apiVersion = configService.get<string>('API_VERSION', '1.0.0')
  const port = configService.get<number>('GATEWAY_PORT', 3030)
  const server = configService.get<string>(
    'SERVER',
    `http://localhost:${port}`,
  )
  const environment = configService.get<string>('NODE_ENV', 'development')

  app.use(json({ limit: '20mb' }))
  app.use(urlencoded({ extended: true, limit: '20mb' }))

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: environment === 'production',
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.enableShutdownHooks()
  app.setGlobalPrefix(globalPrefix, { exclude: ['/', '/health'] })

  const swaggerConfig = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(apiDescription)
    .setVersion(apiVersion)
    .addServer(server, apiName)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'User-JWT',
        description: 'User JWT — obtained from POST /auth/login.',
        in: 'header',
      },
      'User-JWT',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Device-JWT',
        description:
                    'Device JWT — obtained from POST /devices/authenticate using device_id + device_secret.',
        in: 'header',
      },
      'Device-JWT',
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  const swaggerPath = `${globalPrefix}/docs`

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: { persistAuthorization: true },
  })

  await app.listen(port)
  return port
}

bootstrap()
  .then((port) => {
    logger.log(`Server is running at: http://localhost:${port}`)
    logger.log(
      `API Documentation available at: http://localhost:${port}/api/docs`,
    )
  })
  .catch((error: unknown) => {
    const errorMessage
      = error instanceof Error ? error.message : String(error)
    logger.error('Server failed to start up cleanly', errorMessage)
    process.exit(1)
  })
