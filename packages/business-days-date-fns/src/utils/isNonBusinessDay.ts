import { isDate, isWeekend } from "date-fns";
import isSameDay from "date-fns/isSameDay";
import { BadInputError } from "../errors/BadInputError";

export function isNonBusinessDay(nonBusinessDays: Date[], date: Date): boolean {
  if (!isDate(date)) {
    throw new BadInputError(`${date} is not a date`);
  }

  return (
    nonBusinessDays.some((nonBusinessDay) => isSameDay(nonBusinessDay, date)) ||
    isWeekend(date)
  );
}
