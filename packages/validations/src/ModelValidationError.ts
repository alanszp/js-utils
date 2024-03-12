import { ValidationError } from "class-validator";
import { isArray } from "lodash";
import { RenderableContext, HttpRenderableError } from "@alanszp/errors";

export interface ValidationObject {
  property: string;
  constraints: { [type: string]: string };
}

export class ModelValidationError extends HttpRenderableError {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Model Validation Error");
    this.errors = errors;
  }

  public static from(
    objects: ValidationObject | ValidationObject[]
  ): ModelValidationError {
    const arrayObjects = isArray(objects) ? objects : [objects];

    const validationErrors = arrayObjects.map((o) => {
      const validationError = new ValidationError();

      validationError.property = o.property;
      validationError.children = [];
      validationError.constraints = o.constraints;

      return validationError;
    });

    return new ModelValidationError(validationErrors);
  }

  public renderMessage(): string {
    return "Model validation error";
  }

  httpCode(): number {
    return 400;
  }

  public code(): string {
    return "model_validation_error";
  }

  public context(): RenderableContext {
    return {
      errors: this.errors.map((e) => ({
        property: e.property,
        errors: e.constraints,
        children: e.children,
      })),
    };
  }
}
