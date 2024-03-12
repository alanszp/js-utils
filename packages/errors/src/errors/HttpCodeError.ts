import { isFunction } from "../utils/isFunction";
import { RenderableError, isRenderableError } from "./RenderableError";

export interface HttpRenderableError extends RenderableError {
  httpCode(): number;
}

export function isHttpRenderableError(
  error: unknown
): error is HttpRenderableError {
  return isRenderableError(error) && isFunction(error, "httpCode", 0);
}
