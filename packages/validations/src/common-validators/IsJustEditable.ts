import { registerDecorator, ValidationOptions, ValidationTypes } from "class-validator";

export function IsJustEditable(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function justEditableDecorator(object: object, propertyName: string): void {
    registerDecorator({
      name: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      propertyName,
      constraints: [(_object: unknown, value: unknown) => value !== undefined],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return value !== null;
        },
        defaultMessage() {
          return `${propertyName} should not be defined or different than null`;
        },
      },
    });
  };
}
