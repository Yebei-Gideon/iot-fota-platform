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
const LEVEL_COLORS = {
  log: COLORS.green,
  info: COLORS.blue,
  error: COLORS.red,
  warn: COLORS.yellow,
  debug: COLORS.magenta,
  verbose: COLORS.cyan,
}
let lastTimestamp = Date.now()
function getProcessId() {
  if (typeof globalThis !== 'undefined' && 'process' in globalThis) {
    return String(globalThis.process.pid || '')
  }
  return 'browser'
}
export class FotaLogger {
  context
  constructor(context = '') {
    this.context = context
  }

  static formatTimestamp() {
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

  static getMsPassed() {
    const now = Date.now()
    const diff = now - lastTimestamp
    lastTimestamp = now
    return `+${diff}ms`
  }

  static log(...args) {
    new FotaLogger().log(...args)
  }

  static info(...args) {
    new FotaLogger().info(...args)
  }

  static warn(...args) {
    new FotaLogger().warn(...args)
  }

  static debug(...args) {
    new FotaLogger().debug(...args)
  }

  static verbose(...args) {
    new FotaLogger().verbose(...args)
  }

  static error(...args) {
    new FotaLogger().error(...args)
  }

  static colorizeObject(obj) {
    const jsonString = JSON.stringify(obj, null, 2)
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls
      if (match.startsWith('"')) {
        if (match.endsWith(':')) {
          cls = COLORS.cyan
        }
        else {
          cls = COLORS.yellow
        }
      }
      else if (/true|false/.test(match)) {
        cls = COLORS.magenta
      }
      else if (/null/.test(match)) {
        cls = COLORS.red
      }
      else {
        cls = COLORS.blue
      }
      return `${cls}${match}${COLORS.reset}`
    })
  }

  // Use rest operators to bypass NestJS standard parameter bindings
  log(...args) {
    this.print('log', args)
  }

  info(...args) {
    this.print('info', args)
  }

  warn(...args) {
    this.print('warn', args)
  }

  debug(...args) {
    this.print('debug', args)
  }

  verbose(...args) {
    this.print('verbose', args)
  }

  error(...args) {
    this.print('error', args)
  }

  print(level, args) {
    let message = ''
    let activeContext = this.context
    let attachedObject = null
    // Parse incoming arguments strictly by actual data type
    const strings = args.filter(arg => typeof arg === 'string')
    const objects = args.filter(arg => typeof arg === 'object' && arg !== null)
    // Handle standard execution: logger.log("description", { object })
    if (strings.length > 0) {
      // Clean NestJS framework auto-generated string noise
      const cleanStrings = strings.filter(s => s !== '[object Object]')
      if (cleanStrings.length > 0) {
        message = cleanStrings[0] ?? ''
        // If NestJS passed a class context name as a second string argument
        if (cleanStrings.length > 1) {
          activeContext = cleanStrings[1] ?? ''
        }
      }
      else {
        // Fallback if the only string available was the framework artifact
        message = 'Log'
      }
    }
    if (objects.length > 0) {
      attachedObject = objects[0]
    }
    // Fallback: If no strings found but object exists
    if (!message && attachedObject) {
      message = 'Object Payload'
    }
    const timestamp = FotaLogger.formatTimestamp()
    const pidStr = `${COLORS.dim}${getProcessId()}${COLORS.reset}`
    const levelStr = `${LEVEL_COLORS[level]}${COLORS.bold}${level.toUpperCase().padEnd(7)}${COLORS.reset}`
    const contextStr = activeContext ? `${COLORS.yellow}[${activeContext}]${COLORS.reset} ` : ''
    const msPassed = `${COLORS.yellow}${FotaLogger.getMsPassed()}${COLORS.reset}`
    let formattedMessage = message
    if (attachedObject) {
      formattedMessage = `${formattedMessage}\n${FotaLogger.colorizeObject(attachedObject)}`
    }
    const prefix = `${COLORS.green}[FOTA] ${pidStr}  - ${COLORS.gray}${timestamp}${COLORS.reset}   ${levelStr} `
    console.log(`${prefix}${contextStr}${formattedMessage} ${msPassed}`)
    // Error special track for stacks
    if (level === 'error' && strings.length > 1) {
      console.error(`${COLORS.red}${strings[1]}${COLORS.reset}`)
    }
  }
}
