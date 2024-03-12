import { isFunction } from "../utils/isFunction";
import { BaseError } from "./BaseError";

export type RenderableContext = Record<string, unknown>;

export interface RenderableError {
  code(): string;
  renderMessage(): string;
  context(): RenderableContext;
}

export function isRenderableError(error: unknown): error is RenderableError {
  return (
    error instanceof BaseError &&
    isFunction(error, "code", 0) &&
    isFunction(error, "renderMessage", 0) &&
    isFunction(error, "context", 0)
  );
}
