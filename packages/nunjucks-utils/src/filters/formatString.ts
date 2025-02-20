import { isNil, isNumber, isString } from "lodash";

export function formatString(
  text: unknown,
  template: string,
  placeholder = "%",
  defaultTemplate = ""
) {
  if (isNil(text) || !(isString(text) || isNumber(text))) {
    return defaultTemplate;
  }

  return template.split(placeholder).join(text.toString());
}
