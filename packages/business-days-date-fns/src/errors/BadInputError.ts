import { BaseError } from "@alanszp/errors";

export class BadInputError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
