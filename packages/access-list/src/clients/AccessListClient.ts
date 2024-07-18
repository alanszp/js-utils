import { NoPermissionError } from "../errors/NoPermissionError";
import {
  getFullAccessList,
  hasAccessToSomeEmployees,
  whichEmployeesHasAccessTo,
} from "../repositories/accessListRepository";
import { JWTUser } from "@alanszp/jwt";
import { ModelValidationError } from "@alanszp/validations";
import { castArray } from "lodash";

type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type RequiredNull<T> = {
  [P in keyof T]: null;
};

type Ensure<T, K extends keyof T> = T & RequiredNotNull<Pick<T, K>>;

type EnsureNull<T, K extends keyof T> = T & RequiredNull<Pick<T, K>>;

export class AccessListClient {
  public organizationReference: string;

  public segmentReference: string | null;

  public addFormerEmployees: boolean;

  protected roles: string[];

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
  public hasAccessToAll(): this is EnsureNull<this, "segmentReference"> {
    return this.segmentReference === null;
  }

  /**
   * If the user has a segment, it needs to validate access.
   */
  public needsToValidateAccess(): this is Ensure<this, "segmentReference"> {
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
    if (this.needsToValidateAccess()) {
      return hasAccessToSomeEmployees(
        this.segmentReference,
        castArray(employeeReference),
        this.shouldAddFormerEmployees()
      );
    }

    return true;
  }

  /**
   * Returns the filtered list of the given employees that this user has access to.
   *
   * @returns A string[] if it has access to some employees. If it has no access it will return an empty array.
   */
  public async whichEmployeesHasAccess(
    employeeReference: string[]
  ): Promise<string[]> {
    if (this.needsToValidateAccess()) {
      return whichEmployeesHasAccessTo(
        this.segmentReference,
        castArray(employeeReference),
        this.shouldAddFormerEmployees()
      );
    }

    return employeeReference;
  }

  /**
   * Returns the full access list of employees.
   *
   * @returns true if user has access to all employees. A string[] if it has access to some employees.
   */
  public async getFullAccessList(): Promise<string[] | true> {
    if (this.needsToValidateAccess()) {
      return getFullAccessList(
        this.segmentReference,
        this.shouldAddFormerEmployees()
      );
    }

    return true;
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
}
