export interface LoggerEnv {
  LOG_DISABLED?: string | undefined
  LOG_ENABLE?: string | undefined
  LOG_PREFIX?: string | undefined
  LOG_LEVELS?: string | undefined
}

interface KnownEnvVars extends LoggerEnv {
  VITE_LOG_DISABLED?: string | undefined
  VITE_LOG_ENABLE?: string | undefined
  VITE_LOG_PREFIX?: string | undefined
  VITE_LOG_LEVELS?: string | undefined

  NEXT_PUBLIC_LOG_DISABLED?: string | undefined
  NEXT_PUBLIC_LOG_ENABLE?: string | undefined
  NEXT_PUBLIC_LOG_PREFIX?: string | undefined
  NEXT_PUBLIC_LOG_LEVELS?: string | undefined

  REACT_APP_LOG_DISABLED?: string | undefined
  REACT_APP_LOG_ENABLE?: string | undefined
  REACT_APP_LOG_PREFIX?: string | undefined
  REACT_APP_LOG_LEVELS?: string | undefined

  NUXT_PUBLIC_LOG_DISABLED?: string | undefined
  NUXT_PUBLIC_LOG_ENABLE?: string | undefined
  NUXT_PUBLIC_LOG_PREFIX?: string | undefined
  NUXT_PUBLIC_LOG_LEVELS?: string | undefined
}

export function getEnv(): LoggerEnv {
  let rawEnv: KnownEnvVars = {}

  // Safe process.env check
  if (typeof process !== 'undefined' && process && process.env) {
    rawEnv = { ...(process.env as unknown as KnownEnvVars), ...rawEnv }
  }

  // Safe import.meta.env check
  try {
    const meta = import.meta as unknown as { env?: KnownEnvVars }
    if (meta && meta.env) {
      rawEnv = { ...meta.env, ...rawEnv }
    }
  }
  catch {
    // Ignore environments where import.meta throws syntax errors
  }

  return {
    LOG_DISABLED:
            rawEnv.LOG_DISABLED
            ?? rawEnv.VITE_LOG_DISABLED
            ?? rawEnv.NEXT_PUBLIC_LOG_DISABLED
            ?? rawEnv.REACT_APP_LOG_DISABLED
            ?? rawEnv.NUXT_PUBLIC_LOG_DISABLED,

    LOG_ENABLE:
            rawEnv.LOG_ENABLE
            ?? rawEnv.VITE_LOG_ENABLE
            ?? rawEnv.NEXT_PUBLIC_LOG_ENABLE
            ?? rawEnv.REACT_APP_LOG_ENABLE
            ?? rawEnv.NUXT_PUBLIC_LOG_ENABLE,

    LOG_PREFIX:
            rawEnv.LOG_PREFIX
            ?? rawEnv.VITE_LOG_PREFIX
            ?? rawEnv.NEXT_PUBLIC_LOG_PREFIX
            ?? rawEnv.REACT_APP_LOG_PREFIX
            ?? rawEnv.NUXT_PUBLIC_LOG_PREFIX,

    LOG_LEVELS:
            rawEnv.LOG_LEVELS
            ?? rawEnv.VITE_LOG_LEVELS
            ?? rawEnv.NEXT_PUBLIC_LOG_LEVELS
            ?? rawEnv.REACT_APP_LOG_LEVELS
            ?? rawEnv.NUXT_PUBLIC_LOG_LEVELS,
  }
}
