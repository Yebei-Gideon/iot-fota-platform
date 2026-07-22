import * as process from 'node:process'

import { formatMessage } from './formatters/message.formatter.js'
import type { LogContext, LoggerOptions, LogLevel } from './interfaces/logger.interface.js'
import { resolveContext } from './utils/context.util.js'
import { getEnv } from './utils/env.util.js'

const DEFAULT_LOG_LEVELS: LogLevel[] = ['log', 'info', 'error', 'warn', 'debug', 'verbose']

export class FotaLogger {
  private static globalContext: LogContext = 'Application'
  private static globalOptions: LoggerOptions = {}
  private static instance = new FotaLogger()
  private static pid
    = typeof process !== 'undefined' && process.pid ? process.pid : 'browser'

  protected context: string
  protected options: LoggerOptions

  constructor(context?: LogContext, options: LoggerOptions = {}) {
    const env = getEnv()
    const envDisabled = env.LOG_DISABLED === 'true' || env.LOG_ENABLE === 'false'
    const envPrefix = env.LOG_PREFIX
    const rawLogLevels = env.LOG_LEVELS
    const envLevels = rawLogLevels
      ? (rawLogLevels.split(',').map(l => l.trim()) as LogLevel[])
      : undefined

    this.options = {
      timestampFormat: 'locale',
      disabled: envDisabled,
      prefix: envPrefix ?? 'App',
      logLevels: envLevels ?? DEFAULT_LOG_LEVELS,
      ...FotaLogger.globalOptions,
      ...options,
    }

    this.context = resolveContext(context, resolveContext(FotaLogger.globalContext))
  }

  // --- Global Configuration ---
  static setGlobalOptions(options: LoggerOptions) {
    this.globalOptions = options
  }

  static setGlobalContext(context: LogContext) {
    this.globalContext = context
    this.instance.context = resolveContext(context)
  }

  // --- Static Methods ---
  static log(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.log(message, context, ...optionalParams)
  }

  static info(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.info(message, context, ...optionalParams)
  }

  static error(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.error(message, context, ...optionalParams)
  }

  static warn(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.warn(message, context, ...optionalParams)
  }

  static debug(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.debug(message, context, ...optionalParams)
  }

  static verbose(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.instance.verbose(message, context, ...optionalParams)
  }

  // --- Instance Methods ---
  log(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('log', message, context, optionalParams)
  }

  info(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('info', message, context, optionalParams)
  }

  error(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('error', message, context, optionalParams)
  }

  warn(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('warn', message, context, optionalParams)
  }

  debug(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('debug', message, context, optionalParams)
  }

  verbose(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.print('verbose', message, context, optionalParams)
  }

  // --- Private Helpers ---
  private isLevelEnabled(level: LogLevel): boolean {
    if (this.options.disabled)
      return false
    const levels = this.options.logLevels ?? DEFAULT_LOG_LEVELS

    // Treat 'log' and 'info' as equivalent
    if (level === 'log' && levels.includes('info'))
      return true
    if (level === 'info' && levels.includes('log'))
      return true

    return levels.includes(level)
  }

  private print(
    level: LogLevel,
    message: unknown,
    context?: LogContext,
    optionalParams: unknown[] = [],
  ) {
    if (!this.isLevelEnabled(level))
      return

    const activeContext = resolveContext(context, this.context)
    const formattedMsg = formatMessage(
      level,
      message,
      activeContext,
      this.options,
      FotaLogger.pid,
      optionalParams,
    )

    switch (level) {
      case 'error':
        console.error(formattedMsg)
        break
      case 'warn':
        console.warn(formattedMsg)
        break
      case 'debug':
        console.debug(formattedMsg)
        break
      default:
        console.log(formattedMsg)
        break
    }
  }
}
