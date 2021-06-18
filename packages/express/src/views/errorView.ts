import { RenderableError } from "@alanszp/errors";
import { appIdentifier } from "../helpers/appIdentifier";

export function errorView(err: RenderableError): unknown {
  return {
    code: err.code(),
    message: err.renderMessage(),
    context: err.context(),
    origin: appIdentifier(),
  };
}
