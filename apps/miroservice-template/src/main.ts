import 'reflect-metadata'

import { FotaLogger } from '@fota/logger'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'

import { AppModule } from '@/app/app.module'
import { APPLICATION_NAME, TEMPLATE_SERVICE_RABBITMQ } from '@/constants'

const logger = new Logger('Order Service')

const { RABBITMQ_URL } = process.env
const rabbitmqUrl = RABBITMQ_URL as string

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: TEMPLATE_SERVICE_RABBITMQ.queue,
      queueOptions: {
        durable: true,
      },
    },
    logger: {
      log: (msg: unknown, ctx?: string) => FotaLogger.log(msg, ctx),
      error: (msg: unknown, stack?: string, ctx?: string) => FotaLogger.error(msg, stack, ctx),
      warn: (msg: unknown, ctx?: string) => FotaLogger.warn(msg, ctx),
      debug: (msg: unknown, ctx?: string) => FotaLogger.debug(msg, ctx),
      verbose: (msg: unknown, ctx?: string) => FotaLogger.verbose(msg, ctx),
    },
  })

  await app.listen()
}

bootstrap().then(() => logger.log(`${APPLICATION_NAME} is running and listening on RabbitMQ server`)).catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  logger.error(`${APPLICATION_NAME} failed to start up cleanly`, errorMessage)
  process.exit(1)
})
