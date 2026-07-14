import { FotaLogger } from '@fota/logger'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

import { PrismaClient as BasePrismaClient } from './generated/prisma/client.js'

export * from './generated/prisma/client.js'
export * from './generated/prisma/commonInputTypes.js'
export * from './generated/prisma/enums.js'
export * from './generated/prisma/models.js'

const logger = new FotaLogger('@fota/database')

export class FotaPrismaClient extends BasePrismaClient {
  private readonly poolInstance: pg.Pool

  constructor() {
    const { DATABASE_URL } = process.env
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is missing.')
    }
    const connectionString = DATABASE_URL as string

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    // Pass configuration to emit events instead of standard stdout string tags
    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    } as any)

    this.poolInstance = pool

    // Setup internal listeners to intercept and format log events
    this.setupLoggingListeners()
  }

  async closePool() {
    if (this.poolInstance) {
      await this.poolInstance.end()
    }
  }

  private setupLoggingListeners() {
    // @ts-expect-error [Prisma dynamic typing on custom extensions]
    this.$on('query', (e: any) => {
      logger.log(`[Query] [${e.duration}ms] - ${e.query}`)
      if (e.params && e.params !== '[]') {
        logger.log(`[Params] - ${e.params}`)
      }
    })

    // @ts-expect-error [Prisma dynamic typing on custom extensions]
    this.$on('info', (e: any) => {
      logger.info(`[Prisma Info] ${e.message}`)
    })

    // @ts-expect-error [Prisma dynamic typing on custom extensions]
    this.$on('warn', (e: any) => {
      logger.warn(`[Prisma Warn] ${e.message}`)
    })

    // @ts-expect-error [Prisma dynamic typing on custom extensions]
    this.$on('error', (e: any) => {
      logger.error(`[Prisma Error] ${e.message}`)
    })
  }
}
