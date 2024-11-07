import { isArray, sumBy, isFinite, round } from "lodash";

export function safePercentage(array: unknown, locale = "es", fractionDigits: number = 0, suffix = "%"): string[] {
  if (!isArray(array)) return [];
  const numberArray: number[] = array.map(Number);
  if (!numberArray.every((n) => isFinite(n))) return [];

  const sum = sumBy(numberArray);

  const percentageArray = numberArray.map((n) => round((n / sum) * 100, fractionDigits));
  const diffHundred = 100 - sumBy(percentageArray);
  percentageArray[percentageArray.length - 1] += diffHundred;

  return percentageArray.map((n) => `${n.toLocaleString(locale, { maximumFractionDigits: fractionDigits })}${suffix}`);
}
