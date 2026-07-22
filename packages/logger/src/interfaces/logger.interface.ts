export type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose'

// Replaced `Function` with explicit constructor signature and object types
export type LogContext = string | (new (...args: any[]) => unknown) | object

export interface LoggerOptions {
  context?: LogContext
  timestampFormat?: 'iso' | 'locale' | 'time'
  disabled?: boolean
  prefix?: string
  logLevels?: LogLevel[]
}
