import { envSchema } from '@fota-api/types'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { GatewayController } from './gateway.controller'
import { GatewayService } from './gateway.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envSchema,
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {
}
