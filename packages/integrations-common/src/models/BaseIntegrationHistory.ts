import { BaseEntityUuid } from "@alanszp/typeorm";
import { IntegrationResultStatus, IntegrationStatus } from "../types";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn } from "typeorm";

export abstract class BaseIntegrationHistory extends BaseEntityUuid {
  @Column()
  @IsString()
  public integrationId: string;

  @Column()
  @IsString()
  public organizationReference: string;

  @Column({ type: "enum", enum: IntegrationStatus, nullable: false })
  @IsEnum(IntegrationStatus)
  public status: IntegrationStatus;

  @Column({ type: "jsonb" })
  @IsNotEmpty()
  public result: IntegrationResultStatus;

  @CreateDateColumn()
  @IsDate()
  public executedAt: Date;

  @Column()
  @IsString()
  public executedBy: string;
}
