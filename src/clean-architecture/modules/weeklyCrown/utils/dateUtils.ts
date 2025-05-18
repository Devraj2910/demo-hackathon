/**
 * Get the date range for the last week (Monday to Sunday)
 * @returns Object containing startDate and endDate
 */
export function getLastWeekDateRange(): { startDate: Date; endDate: Date } {
  const today = new Date();
  
  // Get last Monday (if today is Monday, get the previous Monday)
  const lastMonday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // If today is Monday (1), subtract 7 days, otherwise subtract days to get to last Monday
  const daysToSubtract = dayOfWeek === 1 ? 7 : (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  lastMonday.setDate(today.getDate() - daysToSubtract);
  
  // Set time to 00:00:00
  lastMonday.setHours(0, 0, 0, 0);
  
  // Calculate last Sunday (6 days after last Monday)
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  
  // Set time to 23:59:59
  lastSunday.setHours(23, 59, 59, 999);
  
  return {
    startDate: lastMonday,
    endDate: lastSunday
  };
}

/**
 * Format a date as YYYY-MM-DD
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Generate a descriptive title for a date range
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted title string
 */
export function generateDateRangeTitle(startDate: Date, endDate: Date): string {
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
} 