import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AppController } from '@/app/app.controller'
import { AppService } from '@/app/app.service'
import { ORDER_SERVICE_RABBITMQ } from '@/constants'

const { RABBITMQ_URL } = process.env
const rabbitmqUrl = RABBITMQ_URL as string

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    ClientsModule.register([
      {
        name: ORDER_SERVICE_RABBITMQ.name,
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: ORDER_SERVICE_RABBITMQ.queue,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
