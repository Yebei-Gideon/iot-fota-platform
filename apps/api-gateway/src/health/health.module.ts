import { FotaLogger } from '@fota/logger'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { PrismaModule } from '@/prisma/prisma.module'

import { HealthController } from './health.controller'
import { SystemHealthIndicator } from './system.health' // Import the provider

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
      logger: FotaLogger, // Using your custom FotaLogger[cite: 1]
    }),
    HttpModule,
    PrismaModule,
  ],
  controllers: [HealthController],
  providers: [SystemHealthIndicator], // Register the custom indicator
})
export class HealthModule {
}
