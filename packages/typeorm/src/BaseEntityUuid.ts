import { PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityWithoutId } from "./BaseEntityWithoutId";

export class BaseEntityUuid extends BaseEntityWithoutId {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  public serializeId(): string {
    return this.id;
  }
}
