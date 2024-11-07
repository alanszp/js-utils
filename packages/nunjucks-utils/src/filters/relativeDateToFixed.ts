import { isString } from "lodash";
import { relativeDateToFixed } from "@alanszp/relative-date";

export { relativeDateToFixed } from "@alanszp/relative-date";

export function relativeDateRangeToFixedArray(range: string): string[] {
  if (!isString(range)) return ["", ""];
  const stringRange = range.toString();
  const [start, end] = stringRange.split(",");
  return [
    relativeDateToFixed(start.trim()) ?? "",
    relativeDateToFixed(end.trim()) ?? "",
  ];
}

export function relativeDateRangeToFixed(range: string): string {
  if (!isString(range)) return "";
  const stringRange = relativeDateRangeToFixedArray(range);
  return stringRange.join(",");
}
