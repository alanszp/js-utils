import { isNil } from "lodash";

export function formatString(
  text: string | number,
  template: string,
  placeholder = "%"
) {
  if (isNil(text)) return "";
  return template.replace(new RegExp(placeholder, "g"), text.toString());
}
