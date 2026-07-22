import { FotaLogger } from '@fota/logger'
import { AuthModule } from '@fota-api/auth/auth.module'
import { SERVICES } from '@fota-api/common'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

const logger = new Logger(`${SERVICES.AUTH.name}`)
logger.log('test', '1', {
  name: 'gideon',
})

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    logger: {
      log: (msg: unknown, ctx?: string) => FotaLogger.log(msg, ctx),
      error: (msg: unknown, stack?: string, ctx?: string) => FotaLogger.error(msg, stack, ctx),
      warn: (msg: unknown, ctx?: string) => FotaLogger.warn(msg, ctx),
      debug: (msg: unknown, ctx?: string) => FotaLogger.debug(msg, ctx),
      verbose: (msg: unknown, ctx?: string) => FotaLogger.verbose(msg, ctx),
    },
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5555,
    },
  })

  app.listen()
  logger.log('Auth microservice is listening on TCP port 5555')
}

bootstrap().then(() => {
  logger.log('Auth microservice bootstrap completed')
}).catch((error) => {
  logger.error('Error during Auth microservice bootstrap', error)
  process.exit(1)
})
