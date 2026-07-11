export function getMonthSlug(baseDate = new Date()): string {
  const date = new Date(baseDate);
  // Move to a day that exists in every month before changing the month.
  // Otherwise dates such as March 31 can overflow back into March.
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}
