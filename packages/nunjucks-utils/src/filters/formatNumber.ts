import { isNumber } from "lodash";
import { isNumberString } from "class-validator";
import { formatString } from "./formatString";

export function formatNumber(
  text: number,
  templateOne: string,
  templateMoreThanOne: string,
  zeroOrNonNumber: string = "",
  placeholder = "%"
): string {
  if (!isNumber(text) && !isNumberString(text)) return zeroOrNonNumber;
  const number = Number(text);
  if (number === 0) return zeroOrNonNumber;
  return text === 1
    ? formatString(text, templateOne, placeholder)
    : formatString(text, templateMoreThanOne, placeholder);
}
