import type { LoggerOptions, LogLevel } from '../interfaces/logger.interface.js'
import type { ColorKey } from '../utils/colors.utils.js'
import { colorize, style } from '../utils/colors.utils.js'
import { getEnv } from '../utils/env.util.js'
import { formatData } from './data.formatter.js'

interface LevelTheme {
  label: string
  badgeColor: ColorKey
  prefixColor: ColorKey
  defaultMsgColor: ColorKey
}

const LEVEL_THEMES: Record<LogLevel, LevelTheme> = {
  log: {
    label: 'LOG',
    badgeColor: 'brightGreen',
    prefixColor: 'green',
    defaultMsgColor: 'green',
  },
  info: {
    label: 'INFO',
    badgeColor: 'brightBlue',
    prefixColor: 'blue',
    defaultMsgColor: 'brightWhite',
  },
  error: {
    label: 'ERROR',
    badgeColor: 'brightRed',
    prefixColor: 'red',
    defaultMsgColor: 'brightRed',
  },
  warn: {
    label: 'WARN',
    badgeColor: 'brightYellow',
    prefixColor: 'yellow',
    defaultMsgColor: 'brightYellow',
  },
  debug: {
    label: 'DEBUG',
    badgeColor: 'brightMagenta',
    prefixColor: 'magenta',
    defaultMsgColor: 'brightMagenta',
  },
  verbose: {
    label: 'VERBOSE',
    badgeColor: 'brightCyan',
    prefixColor: 'cyan',
    defaultMsgColor: 'cyan',
  },
}

/**
 * Smart syntax highlighter for text messages.
 * Colorizes URLs, API routes (/api/v1), HTTP methods (GET/POST), quoted strings, and numbers.
 */
function highlightMessage(text: string, defaultColor: ColorKey): string {
  // 1. URLs (http://localhost:3030/...) -> Underline + Bright Cyan
  let result = text.replace(
    /(https?:\/\/\S+)/g,
    url => style(['underline', 'brightCyan'], url),
  )

  // 2. HTTP Methods (GET, POST, PUT, DELETE, PATCH, OPTIONS) -> Bold Bright Yellow
  result = result.replace(
    /\b(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\b/g,
    method => style(['bold', 'brightYellow'], method),
  )

  // 3. API Routes & Endpoints (e.g. /api/v1, /health, /docs) -> Bold Magenta
  result = result.replace(
    /(\/[\w\-~]+(?:\/[\w\-~]*)*)/g,
    route => style(['bold', 'brightMagenta'], route),
  )

  // 4. Quoted String Literals ('...' or "...") -> Bright Green
  result = result.replace(
    /(["'])(?:\\.|[^\\])*?\1/g,
    str => colorize('brightGreen', str),
  )

  // 5. Numbers -> Bright Yellow
  result = result.replace(
    /\b(\d+)\b/g,
    num => colorize('yellow', num),
  )

  return colorize(defaultColor, result)
}

export function formatMessage(
  level: LogLevel,
  message: unknown,
  context: string,
  options: LoggerOptions,
  pid: string | number,
  optionalParams: unknown[],
): string {
  const now = new Date()
  let timestamp = now.toLocaleString()
  if (options.timestampFormat === 'iso')
    timestamp = now.toISOString()
  if (options.timestampFormat === 'time')
    timestamp = now.toLocaleTimeString()

  // Cast process.env to LoggerEnv so TS recognizes LOG_PREFIX as an explicit property
  const env = getEnv()
  const envPrefix = env.LOG_PREFIX
  const prefix = options.prefix ?? envPrefix ?? 'App'

  const theme = LEVEL_THEMES[level] ?? LEVEL_THEMES.log

  // Section 1: Prefix [FOTA] and PID
  const prefixBracket = colorize(theme.prefixColor, `[${prefix}]`)
  const pidFormatted = colorize('brightGreen', pid)
  const pidStr = `${prefixBracket} ${pidFormatted}  - `

  // Section 2: Timestamp
  const timeStr = colorize('gray', timestamp)

  // Section 3: Log Level Badge
  const levelBadge = style(['bold', theme.badgeColor], theme.label.padEnd(7, ' '))

  // Section 4: Context [GatewayController]
  const contextStr = colorize('brightYellow', `[${context}]`)

  // Section 5: Message Highlighting
  const formattedMessage
    = typeof message === 'string'
      ? highlightMessage(message, theme.defaultMsgColor)
      : `\n${formatData(message)}`

  // Section 6: Optional Params (Objects / Data)
  const formattedParams = optionalParams.length
    ? `\n${optionalParams.map(p => formatData(p)).join('\n')}`
    : ''

  return `${pidStr}${timeStr}     ${levelBadge}${contextStr} ${formattedMessage}${formattedParams}`
}
