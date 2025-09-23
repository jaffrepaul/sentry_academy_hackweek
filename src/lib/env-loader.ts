/**
 * Environment loader utility for different contexts
 * Handles the complexity of loading env vars in Next.js vs CLI contexts
 */

/**
 * Check if we're in a Next.js runtime context
 */
function isNextJsRuntime(): boolean {
  return !!(
    process.env.NEXT_RUNTIME ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.__NEXT_PRIVATE_PREBUNDLED ||
    typeof process.env.NEXT_ROUTER_BASEPATH !== 'undefined'
  )
}

/**
 * Load environment variables if needed
 * Next.js automatically loads .env.local, but CLI tools need manual loading
 */
export function loadEnvironmentIfNeeded(): void {
  // Skip if in browser
  if (typeof window !== 'undefined') {
    return
  }

  // Skip if Next.js is handling it
  if (isNextJsRuntime()) {
    return
  }

  // For all other contexts (CLI tools, scripts, etc.), load manually
  // Use synchronous approach with try/catch for different module systems
  try {
    // Try eval require first (works in most cases)
    const dotenv = eval('require')('dotenv')
    dotenv.config({ path: '.env.local' })
    console.log('📋 Loaded environment variables from .env.local')
  } catch (requireError) {
    // If that fails, it might be an ESM context where require isn't available
    console.warn(
      '⚠️ Could not load .env.local with require:',
      requireError instanceof Error ? requireError.message : String(requireError)
    )

    // In this case, we need the calling code to handle env loading
    console.log('💡 Tip: Ensure .env.local is loaded before importing database modules')
  }
}

/**
 * Get a required environment variable with helpful error message
 */
export function getRequiredEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback

  if (!value) {
    const suggestions = {
      DATABASE_URL: [
        'Create a Neon database at https://neon.tech',
        'Copy your connection string to .env.local',
        'Ensure the format: postgresql://user:pass@host/db?sslmode=require',
      ],
      NEXTAUTH_SECRET: [
        'Generate a secret: openssl rand -base64 32',
        'Add NEXTAUTH_SECRET to .env.local',
      ],
    }

    console.error(`❌ Missing required environment variable: ${key}`)

    if (suggestions[key as keyof typeof suggestions]) {
      console.error('💡 Suggestions:')
      suggestions[key as keyof typeof suggestions].forEach(suggestion => {
        console.error(`  - ${suggestion}`)
      })
    }

    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

/**
 * Get an optional environment variable with type conversion
 */
export function getOptionalEnv<T = string>(
  key: string,
  defaultValue: T,
  transform?: (value: string) => T
): T {
  const value = process.env[key]

  if (!value) {
    return defaultValue
  }

  if (transform) {
    try {
      return transform(value)
    } catch {
      console.warn(`⚠️ Invalid value for ${key}: ${value}, using default: ${defaultValue}`)
      return defaultValue
    }
  }

  return value as T
}

/**
 * Boolean environment variable helper
 */
export function getBooleanEnv(key: string, defaultValue = false): boolean {
  return getOptionalEnv(key, defaultValue, value =>
    ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
  )
}

/**
 * Number environment variable helper
 */
export function getNumberEnv(key: string, defaultValue: number): number {
  return getOptionalEnv(key, defaultValue, value => {
    const num = parseFloat(value)
    if (isNaN(num)) throw new Error('Not a number')
    return num
  })
}
