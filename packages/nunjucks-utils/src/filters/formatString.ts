import { isNil, isNumber, isString } from "lodash";

export function formatString(
  text: unknown,
  template: string,
  placeholder = "%"
) {
  if (isNil(text) || !(isString(text) || isNumber(text))) return "";
  return template.split(placeholder).join(text.toString());
}
