import { validate } from "class-validator";
import { ModelValidationError } from "./ModelValidationError";

/**
 * BaseModel represents a va
 */
export abstract class BaseModel {
  // TODO: This model is shared between baseEntity and baseModel. Do a mixin.
  public async validate(): Promise<void> {
    const validationResult = await validate(this);

    if (validationResult.length > 0) {
      return Promise.reject(new ModelValidationError(validationResult));
    }
    return Promise.resolve();
  }
}
