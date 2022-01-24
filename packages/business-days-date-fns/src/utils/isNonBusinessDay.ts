import { isWeekend, toDate } from "date-fns";
import isSameDay from "date-fns/isSameDay";
import { requiredArgs } from "./requiredArgs";

export function isNonBusinessDay(
  nonBusinessDays: Date[],
  dirtyDate: Date
): boolean {
  requiredArgs(1, [dirtyDate]);

  const date = toDate(dirtyDate);

  return (
    nonBusinessDays.some((nonBusinessDay) => isSameDay(nonBusinessDay, date)) ||
    isWeekend(date)
  );
}
