import { sayHello } from '@fota/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return sayHello('Gideon')
  }
}
