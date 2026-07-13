import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from '@/app.module'

// Instantiate a persistent lifecycle logger for the system bootstrap context
const logger = new Logger('Bootstrap')

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const port = process.env['PORT'] ?? 3030

  await app.listen(port)
  return port
}

bootstrap().then((port) => {
  logger.log(`Server is running at http://localhost:${port}`)
}).catch((error) => {
  logger.error('Server failed to start up cleanly', error)
  process.exit(1)
})
