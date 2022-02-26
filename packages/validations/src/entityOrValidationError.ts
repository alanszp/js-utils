import { ModelValidationError } from "./ModelValidationError";

export function entityOrValidationError<T>(
  entity: T | undefined,
  property: string
): T {
  if (!entity) {
    throw ModelValidationError.from({
      property,
      constraints: {
        mustBePresent: `${property} is not present`,
      },
    });
  }
  return entity;
}
