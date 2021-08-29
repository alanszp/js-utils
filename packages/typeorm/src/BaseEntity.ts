import { PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithoutId } from "./BaseEntityWithoutId";

export class BaseEntity extends BaseEntityWithoutId {
  @PrimaryGeneratedColumn("increment")
  public id: string;

  public serializeId(): string {
    return this.id;
  }
}
