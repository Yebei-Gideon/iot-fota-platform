import { FotaPrismaClient } from '@fota/database'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends FotaPrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleDestroy() {
    await this.$disconnect()
  }

  async onModuleInit() {
    await this.$connect()
  }
}
