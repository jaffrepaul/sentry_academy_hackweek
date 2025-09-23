/**
 * Utility functions for handling rating conversions between database integers and display decimals
 * Database stores ratings as integers (e.g., 49 for 4.9) to avoid floating point precision issues
 */

/**
 * Convert database integer rating to display decimal rating
 * @param dbRating - Integer rating from database (e.g., 49)
 * @returns Decimal rating for display (e.g., 4.9)
 */
export function dbRatingToDisplay(dbRating: number): number {
  return dbRating / 10
}

/**
 * Convert display decimal rating to database integer rating
 * @param displayRating - Decimal rating for display (e.g., 4.9)
 * @returns Integer rating for database storage (e.g., 49)
 */
export function displayRatingToDb(displayRating: number): number {
  return Math.round(displayRating * 10)
}

/**
 * Format rating for display with one decimal place
 * @param rating - Either database integer or display decimal rating
 * @param isDbRating - Whether the input is from database (integer) format
 * @returns Formatted string (e.g., "4.9")
 */
export function formatRating(rating: number, isDbRating: boolean = false): string {
  const displayRating = isDbRating ? dbRatingToDisplay(rating) : rating
  return displayRating.toFixed(1)
}

/**
 * Validate rating value
 * @param rating - Rating value to validate
 * @param isDbRating - Whether the rating is in database format (integer)
 * @returns Boolean indicating if rating is valid
 */
export function isValidRating(rating: number, isDbRating: boolean = false): boolean {
  if (isDbRating) {
    // Database ratings should be integers between 0 and 50 (representing 0.0 to 5.0)
    return Number.isInteger(rating) && rating >= 0 && rating <= 50
  } else {
    // Display ratings should be decimals between 0.0 and 5.0
    return rating >= 0 && rating <= 5.0
  }
}

/**
 * Get star rating components for display
 * @param rating - Either database integer or display decimal rating
 * @param isDbRating - Whether the input is from database (integer) format
 * @returns Object with full stars, half star, and empty stars counts
 */
export function getStarComponents(rating: number, isDbRating: boolean = false) {
  const displayRating = isDbRating ? dbRatingToDisplay(rating) : rating
  const fullStars = Math.floor(displayRating)
  const hasHalfStar = displayRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    displayRating,
  }
}
