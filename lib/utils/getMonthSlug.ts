export function getMonthSlug(baseDate = new Date()): string {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}
