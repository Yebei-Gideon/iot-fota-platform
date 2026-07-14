import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'

import { PrismaService } from '@/prisma/prisma.service'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {
  }

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
      async () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ])
  }
}
