import { createHash } from "crypto";
import { chain, isArray, isBoolean, isNil, isObject, keys } from "lodash";

export function generateChecksum<T extends Record<string, unknown>>(
  employee: T,
  fieldsToIgnore?: Set<keyof T>
): string {
  const hash = createHash("sha1");
  const filterFields = fieldsToIgnore || new Set<keyof T>();
  const employeeString = chain(keys(employee) as (keyof T)[])
    .sort()
    .filter((key) => !filterFields.has(key))
    .map((key) => {
      const value = employee[key];
      if (isObject(value) || isArray(value)) {
        return JSON.stringify(value);
      }

      if (isBoolean(value)) {
        return value ? "1" : "0";
      }

      if (isNil(value)) {
        return "";
      }

      return value;
    })
    .value()
    .join("|");
  return hash.update(employeeString).digest("base64").slice(0, 8);
}
