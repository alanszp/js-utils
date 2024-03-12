import { RenderableError } from "./RenderableError";

export abstract class HttpRenderableError extends RenderableError {
  abstract httpCode(): number;
}
