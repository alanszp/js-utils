import { NoPermissionError } from "../errors/NoPermissionError";
import { hasAccessToSomeEmployees } from "../repositories/accessListRepository";
import { JWTUser } from "@alanszp/jwt";
import { ModelValidationError } from "@alanszp/validations";
import { castArray } from "lodash";

export enum RoleCode {
  ADMIN = "admin",
  HRBP = "hrbp",
  MANAGER = "manager",
  INTEGRATIONS = "integrations",
  VIEWER = "viewer",
}

export class AccessListClient {
  protected organizationReference: string;

  protected roles: string[];

  protected segmentReference: string | null;

  protected addFormerEmployees: boolean;

  constructor(
    {
      roles,
      segmentReference,
      organizationReference,
    }: Pick<JWTUser, "roles" | "segmentReference" | "organizationReference">,
    addFormerEmployees?: boolean,
  ) {
    this.organizationReference = organizationReference;
    this.roles = roles;
    this.segmentReference = segmentReference;
    this.addFormerEmployees = addFormerEmployees ?? false;
  }

  public hasAccessToAll(): boolean {
    return this.isAdmin();
  }

  public isAdmin(): boolean {
    return this.roles.includes(RoleCode.ADMIN);
  }

  public needsToValidateAccess(): boolean {
    return !this.hasAccessToAll();
  }

  public async hasAccessToSomeEmployees(
    employeeReference: string[],
  ): Promise<boolean> {
    if (this.hasAccessToAll()) return true;

    if (!this.segmentReference) return false;

    const hasAccess = await hasAccessToSomeEmployees(
      this.segmentReference,
      castArray(employeeReference),
      this.shouldAddFormerEmployees(),
    );

    return hasAccess;
  }

  public async hasAccessTo(employeeReference: string): Promise<boolean> {
    return this.hasAccessToSomeEmployees(castArray(employeeReference));
  }

  public shouldAddFormerEmployees(): boolean {
    return this.addFormerEmployees;
  }

  /**
   * @param employeeReference Employee reference to validate access to
   * @throws {NoPermissionError} if user has no access to employee
   */
  public async validateAccessTo(employeeReference: string): Promise<void> {
    if (!(await this.hasAccessTo(employeeReference))) {
      throw new NoPermissionError();
    }
  }

  /**
   * @throws {ModelValidationError} if segment reference is not present
   * @returns Segment reference
   */
  public getSegmentReferenceOrFail(): string {
    if (!this.segmentReference) {
      throw ModelValidationError.from({
        property: "segmentReference",
        constraints: {
          segmentReference: "segment reference should be present",
        },
      });
    }

    return this.segmentReference;
  }

  public getSegmentReference(): string | null {
    return this.segmentReference;
  }
}
