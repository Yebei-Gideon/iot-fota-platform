export const colors = {
  reset: '\x1B[0m',
  bold: '\x1B[1m',
  dim: '\x1B[2m',
  italic: '\x1B[3m',
  underline: '\x1B[4m',

  // Standard colors
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',
  gray: '\x1B[90m',

  // Bright variants
  brightRed: '\x1B[91m',
  brightGreen: '\x1B[92m',
  brightYellow: '\x1B[93m',
  brightBlue: '\x1B[94m',
  brightMagenta: '\x1B[95m',
  brightCyan: '\x1B[96m',
  brightWhite: '\x1B[97m',
}

export type ColorKey = keyof typeof colors

export function colorize(color: ColorKey, text: string | number | boolean): string {
  return `${colors[color]}${String(text)}${colors.reset}`
}

export function style(styles: ColorKey[], text: string | number | boolean): string {
  const prefix = styles.map(s => colors[s]).join('')
  return `${prefix}${String(text)}${colors.reset}`
}
