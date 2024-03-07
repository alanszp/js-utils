import { IJWTUser, JWTPayload } from "./types";

export class JWTUser implements IJWTUser {
  id: string;

  employeeReference: string | null;

  organizationReference: string;

  originalOrganizationReference: string | null;

  roles: string[];

  permissions: string;

  segmentReference: string | null;

  constructor({
    id,
    employeeReference,
    organizationReference,
    roles,
    permissions,
    segmentReference,
  }: IJWTUser) {
    this.id = id;
    this.employeeReference = employeeReference;
    this.organizationReference = organizationReference;
    this.roles = roles;
    this.permissions = permissions;
    this.segmentReference = segmentReference;
  }

  static fromPayload(payload: JWTPayload): JWTUser {
    return new JWTUser({
      id: payload.sub,
      employeeReference: payload.ref,
      organizationReference: payload.org,
      roles: payload.rls,
      permissions: payload.prms,
      segmentReference: payload.seg || null,
    });
  }

  public toTokenPayload(): JWTPayload {
    return {
      sub: this.id,
      ref: this.employeeReference,
      org: this.organizationReference,
      rls: this.roles,
      prms: this.permissions,
      seg: this.segmentReference,
    };
  }

  /**
   * Old way of checking for a role
   * Will be replaced by permission checks
   * @param role - role code to check
   */
  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Old way of checking for roles
   * Will be replaced by permission checks
   */
  public hasRoles(validateRoles: string[]): boolean {
    return validateRoles.some((role) => this.hasRole(role));
  }

  /**
   * Check if user has permission to perform an action
   * @note - not implemented, will be implemented in the next release
   * @param permissionCode - permission code to check
   * @returns boolean
   */
  public hasPermission(_permissionCode: string): boolean {
    throw new Error("Not implemented");
  }
}
