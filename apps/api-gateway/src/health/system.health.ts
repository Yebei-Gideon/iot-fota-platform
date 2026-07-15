import { Injectable } from '@nestjs/common'
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus'

@Injectable()
export class SystemHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async checkSystem(key: string, apiVersion: string): Promise<HealthIndicatorResult> {
    // Initialize the check session for this specific key
    const indicator = this.healthIndicatorService.check(key)

    try {
      const memoryUsage = process.memoryUsage()

      // Prepare your custom metric payload
      const result = {
        api_version: apiVersion,
        uptime_seconds: Number.parseFloat(process.uptime().toFixed(2)),
        memory_rss_bytes: memoryUsage.rss,
        memory_heap_used_bytes: memoryUsage.heapUsed,
        memory_heap_total_bytes: memoryUsage.heapTotal,
        node_version: process.version,
      }

      // Report a healthy status and attach your custom payload
      return indicator.up(result)
    }
    catch (error) {
      // Gracefully handle errors and report an unhealthy status
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return indicator.down(errorMessage)
    }
  }
}
