import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import isSameDay from "date-fns/isSameDay";
import isValid from "date-fns/isValid";
import toInteger from "lodash/toInteger";
import isWeekend from "date-fns/isWeekend";
import toDate from "date-fns/toDate";
import { requiredArgs } from "./requiredArgs";
import { isNonBusinessDay } from "./isNonBusinessDay";

export function differenceInBusinessDays(
  nonBusinessDays: Date[],
  dirtyDateLeft: Date | number,
  dirtyDateRight: Date | number
): number {
  // eslint-disable-next-line prefer-rest-params
  requiredArgs(2, [dirtyDateLeft, dirtyDateRight]);

  const dateLeft = toDate(dirtyDateLeft);
  let dateRight = toDate(dirtyDateRight);

  if (!isValid(dateLeft) || !isValid(dateRight)) return Number.NaN;

  const calendarDifference = differenceInCalendarDays(dateLeft, dateRight);
  const sign = calendarDifference < 0 ? -1 : 1;

  const weeks = toInteger(calendarDifference / 7);

  let result = weeks * 5;
  dateRight = addDays(dateRight, weeks * 7);

  while (!isSameDay(dateLeft, dateRight)) {
    result += isWeekend(dateRight) || isNonBusinessDay(nonBusinessDays, dateRight) ? 0 : sign;
    dateRight = addDays(dateRight, sign);
  }

  return result === 0 ? 0 : result;
}
