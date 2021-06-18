import { snakeCase } from "lodash";
import { BaseError } from "../BaseError";
import { RenderableContext, RenderableError } from "../RenderableError";

export abstract class HttpError extends BaseError implements RenderableError {
  constructor() {
    super("HttpError");
  }

  public abstract renderMessage(): string;

  public code(): string {
    return snakeCase(this.renderMessage());
  }

  public context(): RenderableContext {
    return {};
  }
}
