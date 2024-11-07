import { isArray } from "lodash";
import { formatObject } from "./formatObject";
import { Environment } from "nunjucks";

export function formatArray(
  nj: Environment,
  array: unknown,
  joinString: string | false,
  template: string,
  defaultTemplate: string = ""
): string | string[] {
  if (!isArray(array)) return defaultTemplate;
  const mappings = array.map((elem: unknown) =>
    formatObject(nj, { elem }, template, defaultTemplate)
  );
  return joinString === false ? mappings : mappings.join(joinString);
}
