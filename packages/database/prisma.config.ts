import 'dotenv/config'

import { defineConfig } from 'prisma/config'

const { DIRECT_URL, SHADOW_DATABASE_URL } = process.env

if (!DIRECT_URL || !SHADOW_DATABASE_URL) {
  throw new Error('Missing DIRECT_URL or SHADOW_DATABASE_URL in environment variables')
}

const url = DIRECT_URL as string
const shadowDatabaseUrl = SHADOW_DATABASE_URL as string

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url,
    shadowDatabaseUrl,
  },
})
