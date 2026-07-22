import { envSchema } from '@fota-api/types'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envSchema,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
}
