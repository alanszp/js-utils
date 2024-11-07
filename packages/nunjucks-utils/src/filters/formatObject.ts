import { isArray, isObject } from "lodash";
import { Environment } from "nunjucks";
import { HighOrderFilterRenderError } from "../errors/HighOrderFilterRenderError";

export function formatObject(
  nj: Environment,
  object: unknown,
  template: string,
  defaultTemplate: string = ""
): string {
  if (!isObject(object) || isArray(object)) return defaultTemplate;
  try {
    return nj.renderString(template, object).trim();
  } catch (error: unknown) {
    if (
      isObject(error) &&
      typeof (error as Record<"message", string>).message === "string"
    ) {
      throw new HighOrderFilterRenderError(
        template,
        (error as Record<"message", string>).message
      );
    }
    throw error;
  }
}
