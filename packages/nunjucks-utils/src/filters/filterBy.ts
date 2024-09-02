import { isArray, isObject } from "lodash";
import { formatObject } from "./formatObject";
import { Environment } from "nunjucks";

export function filterBy(
  nj: Environment,
  array: unknown,
  templateValue: string
) {
  if (!isArray(array)) return [];
  return array.filter((object: unknown) => {
    if (!isObject(object)) return false;
    const value = formatObject(nj, object, `{{${templateValue}}}`, "false");
    return value === "true" || value === "1";
  }) as unknown[];
}
