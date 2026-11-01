/** Local demo scheduling validation; no service calls. */
export function validateSchedule(date: string, time: string, checks: boolean[], now = new Date()) {
  if (!date) return "Pick a date.";
  if (!time) return "Pick a time.";
  const selected = new Date(`${date}T${time}`);
  if (!Number.isFinite(selected.getTime())) return "Choose a valid date and time.";
  if (selected <= now) return "Choose a date/time in the future.";
  if (checks.length !== 4 || checks.some((c) => !c)) return "Complete the publishing checklist first.";
  return "";
}