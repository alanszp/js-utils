import { isArray, isObject, reject } from "lodash";
import { formatObject } from "./formatObject";
import { Environment } from "nunjucks";

export function rejectBy(
  nj: Environment,
  array: unknown,
  templateValue: string
) {
  if (!isArray(array)) return [];
  return reject(array, (object: unknown) => {
    if (!isObject(object)) return false;
    const value = formatObject(nj, object, `{{${templateValue}}}`, "false");
    return value === "true" || value === "1";
  }) as unknown[];
}
