import { appIdentifier } from "@alanszp/core";
import { RenderableView } from "@alanszp/errors";

export function render401Error(requiredChecks: string[]): RenderableView {
  return {
    code: "unauthorized_error",
    message: "Unauthorized Error",
    context: { requiredChecks },
    origin: appIdentifier(),
  };
}

export function render403Error(): RenderableView {
  return {
    code: "forbidden",
    message: "Forbidden",
    context: {},
    origin: appIdentifier(),
  };
}

export function render404Error(): RenderableView {
  return {
    code: "not_found",
    message: "Not Found",
    context: {},
    origin: appIdentifier(),
  };
}

export function render400Error(message: string): RenderableView {
  return {
    code: "bad_request",
    message,
    context: {},
    origin: appIdentifier(),
  };
}
