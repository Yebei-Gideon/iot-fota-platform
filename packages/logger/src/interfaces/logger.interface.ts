export type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose'

export type LogContext = string | (new (...args: any[]) => unknown) | object | null

export interface LoggerOptions {
  context?: LogContext
  timestampFormat?: 'iso' | 'locale' | 'time'
  disabled?: boolean
  prefix?: string
  logLevels?: LogLevel[]
}
