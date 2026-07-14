/* eslint-disable no-console */
export type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose'

const COLORS = {
  reset: '\x1B[0m',
  bold: '\x1B[1m',
  dim: '\x1B[2m',
  gray: '\x1B[90m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  red: '\x1B[31m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  blue: '\x1B[34m',
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  log: COLORS.green,
  info: COLORS.blue,
  error: COLORS.red,
  warn: COLORS.yellow,
  debug: COLORS.magenta,
  verbose: COLORS.cyan,
}

let lastTimestamp = Date.now()

function getProcessId(): string {
  if (typeof globalThis !== 'undefined' && 'process' in globalThis) {
    return String((globalThis as any).process.pid || '')
  }
  return 'browser'
}

export class FotaLogger {
  private readonly context: string

  constructor(context: string = '') {
    this.context = context
  }

  private static formatTimestamp(): string {
    const now = new Date()
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  private static getMsPassed(): string {
    const now = Date.now()
    const diff = now - lastTimestamp
    lastTimestamp = now
    return `+${diff}ms`
  }

  private print(level: LogLevel, message: any, context?: string, stack?: string) {
    const activeContext = context || this.context
    const timestamp = FotaLogger.formatTimestamp()

    const pidStr = `${COLORS.dim}${getProcessId()}${COLORS.reset}`
    const levelStr = `${LEVEL_COLORS[level]}${COLORS.bold}${level.toUpperCase().padEnd(7)}${COLORS.reset}`
    const contextStr = activeContext ? `${COLORS.yellow}[${activeContext}]${COLORS.reset} ` : ''
    const msPassed = `${COLORS.yellow}${FotaLogger.getMsPassed()}${COLORS.reset}`

    let formattedMessage = message
    if (typeof message === 'object') {
      formattedMessage = JSON.stringify(message, null, 2)
    }

    const prefix = `${COLORS.green}[FOTA] ${pidStr}  - ${COLORS.gray}${timestamp}${COLORS.reset}   ${levelStr} `

    console.log(`${prefix}${contextStr}${formattedMessage} ${msPassed}`)

    if (level === 'error' && stack) {
      console.error(`${COLORS.red}${stack}${COLORS.reset}`)
    }
  }

  log(message: any, context?: string) {
    this.print('log', message, context)
  }

  info(message: any, context?: string) {
    this.print('info', message, context)
  }

  error(message: any, stack?: string, context?: string) {
    this.print('error', message, context, stack)
  }

  warn(message: any, context?: string) {
    this.print('warn', message, context)
  }

  debug(message: any, context?: string) {
    this.print('debug', message, context)
  }

  verbose(message: any, context?: string) {
    this.print('verbose', message, context)
  }

  static log(message: any, context?: string) {
    new FotaLogger(context).log(message)
  }

  static info(message: any, context?: string) {
    new FotaLogger(context).info(message)
  }

  static error(message: any, stack?: string, context?: string) {
    new FotaLogger(context).error(message, stack)
  }

  static warn(message: any, context?: string) {
    new FotaLogger(context).warn(message)
  }

  static debug(message: any, context?: string) {
    new FotaLogger(context).debug(message)
  }

  static verbose(message: any, context?: string) {
    new FotaLogger(context).verbose(message)
  }
}
