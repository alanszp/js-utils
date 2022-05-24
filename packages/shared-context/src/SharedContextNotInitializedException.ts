import { BaseError } from "@alanszp/errors";

export class SharedContextNotInitializedException extends BaseError {
  constructor() {
    super("Shared context wasn't initialized correctly.");
  }
}
