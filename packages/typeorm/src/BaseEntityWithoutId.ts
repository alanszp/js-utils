import { validate } from "class-validator";
import {
  BaseEntity as TypeOrmBaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { ModelValidationError } from "./ModelValidationError";

export abstract class BaseEntityWithoutId extends TypeOrmBaseEntity {
  // TODO: This model is shared between baseEntity and baseModel. Do a mixin.
  @BeforeInsert()
  @BeforeUpdate()
  public async validate(): Promise<void> {
    const validationResult = await validate(this);

    if (validationResult.length > 0) {
      return Promise.reject(new ModelValidationError(validationResult));
    }
    return Promise.resolve();
  }

  public abstract serializeId(): string;

  public toJSON(): { id: string } {
    return { id: this.serializeId() };
  }
}
