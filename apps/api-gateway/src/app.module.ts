import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { HealthModule } from '@/health/health.module'

export const AUTH_SERVICE_RABBITMQ: string = 'rabbitmq_order_service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://fota_user:fota_password@localhost:5672'],
          queue: 'auth_server_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
