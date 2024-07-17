import { NoPermissionError } from "../errors/NoPermissionError";
import {
  getFullAccessList,
  hasAccessToSomeEmployees,
  whichEmployeesHasAccessTo,
} from "../repositories/accessListRepository";
import { JWTUser } from "@alanszp/jwt";
import { ModelValidationError } from "@alanszp/validations";
import { castArray } from "lodash";

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
    addFormerEmployees?: boolean
  ) {
    this.organizationReference = organizationReference;
    this.roles = roles;
    this.segmentReference = segmentReference;
    this.addFormerEmployees = addFormerEmployees ?? false;
  }

  /**
   * If the user has no segment, it means that it has access to all employees.
   */
  public hasAccessToAll(): boolean {
    return this.segmentReference === null;
  }

  /**
   * If the user has a segment, it needs to validate access.
   */
  public needsToValidateAccess(): boolean {
    return !this.hasAccessToAll();
  }

  /**
   * Returns a boolean if the user has access any of the given employees.
   *
   * @returns A string[] if it has access to some employees. If it has no access it will return an empty array.
   */
  public async hasAccessToSomeEmployees(
    employeeReference: string[]
  ): Promise<boolean> {
    if (this.hasAccessToAll() || this.segmentReference === null) return true;

    return hasAccessToSomeEmployees(
      this.segmentReference,
      castArray(employeeReference),
      this.shouldAddFormerEmployees()
    );
  }

  /**
   * Returns the filtered list of the given employees that this user has access to.
   *
   * @returns A string[] if it has access to some employees. If it has no access it will return an empty array.
   */
  public async whichEmployeesHasAccess(
    employeeReference: string[]
  ): Promise<string[]> {
    if (this.hasAccessToAll() || this.segmentReference === null)
      return employeeReference;

    return whichEmployeesHasAccessTo(
      this.segmentReference,
      castArray(employeeReference),
      this.shouldAddFormerEmployees()
    );
  }

  /**
   * Returns the full access list of employees.
   *
   * @returns true if user has access to all employees. A string[] if it has access to some employees.
   */
  public async getFullAccessList(): Promise<string[] | true> {
    if (this.hasAccessToAll() || this.segmentReference === null) return true;

    return getFullAccessList(
      this.segmentReference,
      this.shouldAddFormerEmployees()
    );
  }

  /**
   * Returns a boolean if the user has access to that employee.
   */
  public async hasAccessTo(employeeReference: string): Promise<boolean> {
    return this.hasAccessToSomeEmployees(castArray(employeeReference));
  }

  public shouldAddFormerEmployees(): boolean {
    return this.addFormerEmployees;
  }

  /**
   * Like #hasAccessTo but instead of returning a boolean it will throw a NoPermissionError if the user has no access.
   *
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
