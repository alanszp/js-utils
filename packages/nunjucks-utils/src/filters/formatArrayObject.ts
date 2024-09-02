import { isArray } from "lodash";
import { formatObject } from "./formatObject";
import { Environment } from "nunjucks";

export function formatArrayObject(
  nj: Environment,
  arrayOfObjects: unknown,
  joinString: string | false,
  template: string,
  defaultTemplate: string = ""
): string | string[] {
  if (!isArray(arrayOfObjects)) return defaultTemplate;
  const mappings = arrayOfObjects.map((object: unknown) =>
    formatObject(nj, object, template, defaultTemplate)
  );
  return joinString === false ? mappings : mappings.join(joinString);
}
