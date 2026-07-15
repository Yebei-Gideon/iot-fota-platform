import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'

import { SystemHealthIndicator } from '@/health/system.health'
import { PrismaService } from '@/prisma/prisma.service'

export interface HealthResponsePayload {
  status?: string
  info?: Record<string, any>
  error?: Record<string, any>
  details?: Record<string, any>
  meta?: {
    timestamp: string
    latency_ms: number
  }

  [key: string]: any
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly systemHealth: SystemHealthIndicator,
    private readonly prisma: PrismaService,
  ) {
  }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Get system health, API metrics, and dependency statuses' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      status: 'ok',
      info: {
        system_metrics: {
          status: 'up',
          api_version: '1.0.0',
          uptime_seconds: 49.2,
          memory_rss_bytes: 150253568,
          memory_heap_used_bytes: 31895117,
          memory_heap_total_bytes: 20699136,
          node_version: 'v24.3.0',
        },
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
        prisma: { status: 'up' },
        Documentation: { status: 'up' },
      },
      error: {},
      details: {
        system_metrics: {
          status: 'up',
          api_version: '1.0.0',
          uptime_seconds: 49.2,
          memory_rss_bytes: 150253568,
          memory_heap_used_bytes: 31895117,
          memory_heap_total_bytes: 20699136,
          node_version: 'v24.3.0',
        },
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
        prisma: { status: 'up' },
        Documentation: { status: 'up' },
      },
      meta: {
        timestamp: '2026-07-14T18:02:44.155Z',
        latency_ms: 55,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    example: {
      status: 'error',
      info: {
        system_metrics: {
          status: 'up',
          api_version: '1.0.0',
          uptime_seconds: 52.1,
          memory_rss_bytes: 150253568,
          memory_heap_used_bytes: 31895117,
          memory_heap_total_bytes: 20699136,
          node_version: 'v24.3.0',
        },
        Documentation: { status: 'up' },
      },
      error: {
        prisma: {
          status: 'down',
          message: 'Could not connect to database',
        },
      },
      details: {
        system_metrics: {
          status: 'up',
          api_version: '1.0.0',
          uptime_seconds: 52.1,
          memory_rss_bytes: 150253568,
          memory_heap_used_bytes: 31895117,
          memory_heap_total_bytes: 20699136,
          node_version: 'v24.3.0',
        },
        Documentation: { status: 'up' },
        prisma: {
          status: 'down',
          message: 'Could not connect to database',
        },
      },
      meta: {
        timestamp: '2026-07-14T18:02:48.000Z',
        latency_ms: 120,
      },
    },
  })
  async check() {
    const startTime = Date.now()

    const { API_VERSION, API_URL, API_PREFIX } = process.env
    const apiUrl = (API_URL as string).replace(/\/$/, '')
    const apiVersion = API_VERSION as string
    const apiPrefix = (API_PREFIX as string).replace(/^\/|\/$/g, '')
    const docsUrl = `${apiUrl}/${apiPrefix}/docs`

    try {
      const result = await this.health.check([
        async () => this.systemHealth.checkSystem('system_metrics', apiVersion),
        async () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
        async () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), // 300MB
        async () => this.prismaHealth.pingCheck('prisma', this.prisma),
        async () => this.http.pingCheck('Documentation', docsUrl),
      ])

      return {
        ...result,
        meta: {
          timestamp: new Date().toISOString(),
          latency_ms: Date.now() - startTime,
        },
      }
    }
    catch (error: unknown) {
      if (error instanceof HttpException) {
        const response = error.getResponse() as HealthResponsePayload
        if (typeof response === 'object' && response !== null) {
          response.meta = {
            timestamp: new Date().toISOString(),
            latency_ms: Date.now() - startTime,
          }
        }
      }
      throw error
    }
  }
}
