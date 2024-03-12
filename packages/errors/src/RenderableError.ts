import { snakeCase } from "lodash";
import { appIdentifier } from "@alanszp/core";
import { BaseError } from "./BaseError";

export type RenderableContext = Record<string, unknown>;

export interface RenderableView {
  code: string;
  message: string;
  context: RenderableContext;
  origin: string;
}

export abstract class RenderableError extends BaseError {
  constructor(renderMessage: string) {
    super(renderMessage);
  }

  code(): string {
    return snakeCase(this.message);
  }

  renderMessage(): string {
    return this.message;
  }

  toView(): Record<string, unknown> {
    return {
      code: this.code(),
      message: this.renderMessage(),
      context: this.context(),
      origin: appIdentifier(),
    };
  }

  abstract context(): RenderableContext;
}
