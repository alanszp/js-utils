import {
  add,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  sub,
} from "date-fns";
import { isString } from "lodash";

type Operator = "+" | "-";
type TimeUnit =
  | "d"
  | "day"
  | "days"
  | "w"
  | "week"
  | "weeks"
  | "m"
  | "month"
  | "months"
  | "q"
  | "quarter"
  | "quarters"
  | "y"
  | "year"
  | "years";

type PeriodModifierExtreme = "s" | "e";
type PeriodModifierTimeUnit = "w" | "m" | "q" | "y";

// Will modify now or the relative date, and move date to an extreme of the time unit defined.
// ej: -2d:eoy --> will calculate -2d and to the resulting date, will change the date & month to XXXX-12-31
type PeriodModifier = `${PeriodModifierExtreme}o${PeriodModifierTimeUnit}`;

type RelativeDateWithoutModifiers = `${Operator}${number}${TimeUnit}` | "now";

type RelativeDate =
  | `${RelativeDateWithoutModifiers}`
  | `${RelativeDateWithoutModifiers}:${PeriodModifier}`;

type TimeUnitAndQuantity = { unit: TimeUnit; quantity: number };

// date format compliant with ISO
const RelativeDateUnit = <const>{
  DAYS: "days",
  WEEKS: "weeks",
  MONTHS: "months",
  YEARS: "years",
  NOW: "now",
};

const PLUS = "+";

const RELATIVE_DATE_REGEX =
  /^\s*(([+-])\s*(\d+)\s*(d|day|days|w|week|weeks|m|month|months|q|quarter|quarters|y|year|years)|now)(?:\s*:\s*([es])o([mqwy]))?\s*$/;

function defaultRelativeDateConversor(
  unit: TimeUnit
): (quantity: number) => TimeUnitAndQuantity {
  return (quantity: number) => ({ unit, quantity });
}
const RELATIVE_DATE_MAP: Record<TimeUnit, (q: number) => TimeUnitAndQuantity> =
  {
    d: defaultRelativeDateConversor(RelativeDateUnit.DAYS),
    day: defaultRelativeDateConversor(RelativeDateUnit.DAYS),
    days: defaultRelativeDateConversor(RelativeDateUnit.DAYS),
    w: defaultRelativeDateConversor(RelativeDateUnit.WEEKS),
    week: defaultRelativeDateConversor(RelativeDateUnit.WEEKS),
    weeks: defaultRelativeDateConversor(RelativeDateUnit.WEEKS),
    m: defaultRelativeDateConversor(RelativeDateUnit.MONTHS),
    month: defaultRelativeDateConversor(RelativeDateUnit.MONTHS),
    months: defaultRelativeDateConversor(RelativeDateUnit.MONTHS),
    q: (q: number) => ({ unit: RelativeDateUnit.MONTHS, quantity: q * 3 }),
    quarter: (q: number) => ({
      unit: RelativeDateUnit.MONTHS,
      quantity: q * 3,
    }),
    quarters: (q: number) => ({
      unit: RelativeDateUnit.MONTHS,
      quantity: q * 3,
    }),
    y: defaultRelativeDateConversor(RelativeDateUnit.YEARS),
    year: defaultRelativeDateConversor(RelativeDateUnit.YEARS),
    years: defaultRelativeDateConversor(RelativeDateUnit.YEARS),
  };
function parseRelativeDate(
  fullRelative: string,
  operator: string,
  rawQuantity: TimeUnit,
  rawTimeUnit: string
): Date {
  if (fullRelative === RelativeDateUnit.NOW) {
    return new Date();
  }

  const op = operator === PLUS ? add : sub;
  const { unit, quantity } = RELATIVE_DATE_MAP[rawTimeUnit as TimeUnit](
    Number.parseInt(rawQuantity, 10)
  );
  return op(new Date(), { [unit]: quantity });
}

const MODIFIER_FN_MAP: Record<
  PeriodModifierExtreme,
  Record<PeriodModifierTimeUnit, (date: Date) => Date>
> = {
  e: {
    w: endOfWeek,
    m: endOfMonth,
    q: endOfQuarter,
    y: endOfYear,
  },
  s: {
    w: startOfWeek,
    m: startOfMonth,
    q: startOfQuarter,
    y: startOfYear,
  },
};

function modifyDate(date: Date, extreme: string, timeUnit: string): Date {
  return (
    MODIFIER_FN_MAP[extreme as PeriodModifierExtreme]?.[
      timeUnit as PeriodModifierTimeUnit
    ]?.(date) ?? date
  );
}

function isRelativeDate(raw: string): raw is RelativeDate {
  return RELATIVE_DATE_REGEX.test(raw);
}

// date format compliant with ISO
export const INPUT_DATE_FORMAT = <const>"yyyy-MM-dd";

function formatDate(date: Date): string {
  return format(date, INPUT_DATE_FORMAT);
}

/**
 * Given a relative format date (-/+ <number> <d|w|m|q|y> (: <s|e>o<w|m|q|y>)?) will
 * return an absolute day.
 *
 * If the format does not match the relative date, will return the same string.
 *
 * @param date Date in relative or absolute format.
 * @returns Date in absolute format.
 */
export function relativeDateToFixed(date: string): string {
  if (!isString(date)) return "";

  const stringDate = date.toString();
  if (!isRelativeDate(stringDate)) {
    return stringDate;
  }

  const result = RELATIVE_DATE_REGEX.exec(stringDate);
  if (!result) {
    throw new Error("Relative date error parsing");
  }

  const [
    ,
    fullRelative,
    operator,
    rawQuantity,
    rawTimeUnit,
    modifierExtreme,
    modifierTimeUnit,
  ] = result;

  const relativeDate = parseRelativeDate(
    fullRelative,
    operator,
    rawQuantity as TimeUnit,
    rawTimeUnit
  );

  if (!modifierExtreme || !modifierTimeUnit) {
    return formatDate(relativeDate);
  }

  return formatDate(
    modifyDate(relativeDate, modifierExtreme, modifierTimeUnit)
  );
}

export function relativeDateRangeToFixedArray(
  range: string
): (string | null)[] {
  if (!isString(range)) return [null, null];
  const stringRange = range.toString();
  const [start, end] = stringRange.split(",");
  return [
    relativeDateToFixed(start.trim()) ?? null,
    relativeDateToFixed(end.trim()) ?? null,
  ];
}

export function relativeDateRangeToFixed(range: string): string | null {
  if (!isString(range)) return null;
  const stringRange = relativeDateRangeToFixedArray(range);
  if (stringRange.some((date) => date === null)) {
    return null;
  }
  return stringRange.join(",");
}
