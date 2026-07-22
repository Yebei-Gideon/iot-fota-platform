import { colorize, style } from '../utils/colors.utils.js'

export function formatData(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth)

  if (typeof value === 'string')
    return colorize('green', `'${value}'`)
  if (typeof value === 'number')
    return colorize('yellow', value)
  if (typeof value === 'boolean')
    return colorize('brightMagenta', value)
  if (value === null)
    return colorize('gray', 'null')
  if (value === undefined)
    return colorize('gray', 'undefined')

  const braceOpen = colorize('gray', '{')
  const braceClose = colorize('gray', '}')
  const bracketOpen = colorize('gray', '[')
  const bracketClose = colorize('gray', ']')
  const comma = colorize('gray', ',')
  const colon = colorize('gray', ':')

  if (Array.isArray(value)) {
    if (value.length === 0)
      return `${bracketOpen}${bracketClose}`
    const inner = value
      .map(v => `${indent}  ${formatData(v, depth + 1)}`)
      .join(`${comma}\n`)
    return `${bracketOpen}\n${inner}\n${indent}${bracketClose}`
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>)
    if (keys.length === 0)
      return `${braceOpen}${braceClose}`
    const inner = keys
      .map((k) => {
        const keyStr = style(['brightCyan'], k)
        const valStr = formatData((value as Record<string, unknown>)[k], depth + 1)
        return `${indent}  ${keyStr}${colon} ${valStr}`
      })
      .join(`${comma}\n`)
    return `${braceOpen}\n${inner}\n${indent}${braceClose}`
  }

  return String(value)
}
