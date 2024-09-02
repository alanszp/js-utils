import { isArray, isObject } from "lodash";
import { formatObject } from "./formatObject";
import { Environment } from "nunjucks";

export function calculateProperty(
  nj: Environment,
  arrayOfObjects: unknown,
  key: string,
  templateValue: string,
  convertTo: "string" | "int" | "float" = "string"
): object[] {
  if (!isArray(arrayOfObjects) || arrayOfObjects.some((obj) => !isObject(obj)))
    return [];

  return (arrayOfObjects as object[]).map((obj: object) => {
    const copyObject: Record<string, unknown> = { ...obj };
    const value = formatObject(
      nj,
      copyObject,
      `{{${templateValue}}}`,
      convertTo === "string" ? "" : "0"
    );
    if (convertTo === "int") {
      copyObject[key] = Number.parseInt(value, 10);
    } else if (convertTo === "float") {
      copyObject[key] = Number.parseFloat(value);
    } else {
      copyObject[key] = value;
    }

    return copyObject;
  });
}
