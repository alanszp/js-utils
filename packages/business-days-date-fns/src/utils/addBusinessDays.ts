import toDate from "date-fns/toDate";
import isSunday from "date-fns/isSunday";
import isSaturday from "date-fns/isSaturday";
import { toInteger } from "lodash";
import { isNonBusinessDay } from "./isNonBusinessDay";
import { requiredArgs } from "./requiredArgs";

export function addBusinessDays(
  nonBusinessDays: Date[],
  dirtyDate: Date | number,
  dirtyAmount: number
): Date {
  requiredArgs(2, [dirtyDate, dirtyAmount]);

  const date = toDate(dirtyDate);
  const startedOnWeekend = isNonBusinessDay(nonBusinessDays, date);
  const amount = toInteger(dirtyAmount);

  if (Number.isNaN(amount)) return new Date(Number.NaN);

  const hours = date.getHours();
  const sign = amount < 0 ? -1 : 1;
  const fullWeeks = toInteger(amount / 5);

  date.setDate(date.getDate() + fullWeeks * 7);

  let restDays = Math.abs(amount % 5);

  while (restDays > 0) {
    date.setDate(date.getDate() + sign);
    if (!isNonBusinessDay(nonBusinessDays, date)) restDays -= 1;
  }

  if (
    startedOnWeekend &&
    isNonBusinessDay(nonBusinessDays, date) &&
    amount !== 0
  ) {
    if (isSaturday(date)) date.setDate(date.getDate() + (sign < 0 ? 2 : -1));
    if (isSunday(date)) date.setDate(date.getDate() + (sign < 0 ? 1 : -2));
  }

  date.setHours(hours);

  return date;
}
