import { COUNTRY_CODE_TO_NAME, FULL_COUNTRY_NAMES } from '../constants'

/**
 * Convert country code to full country name
 * @param code - ISO country code (e.g., 'US', 'UK', 'IN')
 * @returns Full country name or the original code if not found
 */
export const getCountryName = (code: string): string => {
  return COUNTRY_CODE_TO_NAME[code.toUpperCase()] || code
}

/**
 * Get a random full country name for data generation
 * @returns Random country name from the full list
 */
export const getRandomCountryName = (): string => {
  return FULL_COUNTRY_NAMES[Math.floor(Math.random() * FULL_COUNTRY_NAMES.length)]
}

/**
 * Check if a value is a country code or full name
 * @param value - Country value to check
 * @returns true if it's likely a country code (2-3 letters)
 */
export const isCountryCode = (value: string): boolean => {
  return value.length <= 3 && value === value.toUpperCase()
}

/**
 * Get all available country codes
 * @returns Array of country codes
 */
export const getCountryCodes = (): string[] => {
  return Object.keys(COUNTRY_CODE_TO_NAME)
}

/**
 * Get all available full country names
 * @returns Array of full country names
 */
export const getAllCountryNames = (): string[] => {
  return [...FULL_COUNTRY_NAMES]
}

/**
 * Validate if a country code exists in our mapping
 * @param code - Country code to validate
 * @returns true if the code exists
 */
export const isValidCountryCode = (code: string): boolean => {
  return code.toUpperCase() in COUNTRY_CODE_TO_NAME
}

// Re-export constants for backward compatibility
export { COUNTRY_CODE_TO_NAME as countryCodeToName, FULL_COUNTRY_NAMES as fullCountryNames } from '../constants'
