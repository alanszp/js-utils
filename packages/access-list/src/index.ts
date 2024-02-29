export const HOLA = "hola";

import { AccessListClient } from "@/lib/clients/accessList/AccessListClient";
import { JWTUser } from "@alanszp/jwt";
import { BaseModel } from "@alanszp/validations";
import { IsDefined } from "class-validator";

export class AccessListInput extends BaseModel {
  @IsDefined()
  public user: JWTUser;

  constructor(user: JWTUser) {
    super();
    this.user = user;
  }

  public getAccessList(shouldAddFormerEmployees?: boolean): AccessListClient {
    return new AccessListClient(this.user, shouldAddFormerEmployees);
  }
}
