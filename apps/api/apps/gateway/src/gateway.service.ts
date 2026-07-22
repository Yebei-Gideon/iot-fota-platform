import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class GatewayService {
  getHello(): string {
    Logger.log({ name: 'Gateway Service', level: 'info' })
    return 'Hello World!'
  }
}
