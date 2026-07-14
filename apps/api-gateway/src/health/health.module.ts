import { FotaLogger } from '@fota/logger'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { PrismaModule } from '@/prisma/prisma.module'

import { HealthController } from './health.controller'

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      logger: FotaLogger,
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {
}
