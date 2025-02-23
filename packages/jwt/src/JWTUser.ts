import { BitmaskUtils } from "./BitmaskUtils";
import { IPermissionService } from "./PermissionService";
import { PermissionDefinitionNotFound } from "./errors/PermissionNotFound";
import { PermissionServiceNotInstantiated } from "./errors/PermissionServiceNotInstantiated";
import { IJWTUser, JWTPayload, Permission } from "./types";
import { NoPermissionError } from "./errors/NoPermissionError";

export class JWTUser implements IJWTUser {
  jwtId: string | null;

  id: string;

  employeeReference: string | null;

  organizationReference: string;

  originalOrganizationReference: string | null;

  originalId: string | null;

  originalEmployeeReference: string | null;

  /**
   * Old role codes to maintain backwards compatibility
   */
  roles: string[];

  /**
   * Role ids
   */
  roleReferences: string[];

  permissions: string;

  segmentReference: string | null;

  expirationTime?: number;

  #rawToken?: string;

  /**
   * Static reference to the permission service
   * This is used to make sure that the permission service is only instantiated once
   * and can be used by all instances of JWTUser
   */
  static #permissionService: IPermissionService | null = null;

  /**
   * Instantiate the permission service for all instances of JWTUser
   */
  static setPermissionService(service: IPermissionService): void {
    JWTUser.#permissionService = service;
  }

  /**
   * @throws {PermissionServiceNotInstantiated}
   */
  static getPermissionService(): IPermissionService {
    if (!JWTUser.#permissionService) {
      throw new PermissionServiceNotInstantiated();
    }
    return JWTUser.#permissionService;
  }

  /**
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  static async getPermissionDefinition(
    permissionCode: string
  ): Promise<Permission> {
    const definition = await JWTUser.getPermissionService().getPermission(
      permissionCode
    );
    if (!definition) {
      throw new PermissionDefinitionNotFound(permissionCode);
    }
    return definition;
  }

  constructor({
    jwtId,
    id,
    employeeReference,
    organizationReference,
    roles,
    roleReferences,
    permissions,
    segmentReference,
    originalOrganizationReference,
    originalId,
    originalEmployeeReference,
    expirationTime,
  }: IJWTUser) {
    this.jwtId = jwtId ?? null;
    this.id = id;
    this.employeeReference = employeeReference;
    this.organizationReference = organizationReference;
    this.roleReferences = roleReferences;
    this.roles = roles;
    this.permissions = permissions;
    this.segmentReference = segmentReference;
    this.originalOrganizationReference =
      originalOrganizationReference ?? organizationReference;
    this.originalId = originalId ?? id;
    this.originalEmployeeReference =
      originalEmployeeReference ?? employeeReference;
    this.expirationTime = expirationTime;
  }

  /**
   * Set the raw token from the original request
   * @description Do not include the Bearer prefix
   */
  public setRawToken(token: string): void {
    this.#rawToken = token;
  }

  /**
   * JWT Token from the original request
   * Useful for chaining requests and passing the token along
   * @description This method applies the Bearer prefix to the token, if you need the raw token use the property `rawToken`
   */
  public getRawTokenAsBearer(): string | undefined {
    return this.#rawToken ? `Bearer ${this.#rawToken}` : undefined;
  }

  static fromPayload(payload: JWTPayload): JWTUser {
    return new JWTUser({
      jwtId: payload.jti ?? null,
      id: payload.sub,
      employeeReference: payload.ref,
      organizationReference: payload.org,
      roles: payload.rls,
      roleReferences: payload.rl,
      permissions: payload.prms,
      segmentReference: payload.seg || null,
      originalOrganizationReference: payload.oorg ?? payload.org,
      originalId: payload.osub ?? payload.sub,
      originalEmployeeReference: payload.oref ?? payload.ref,
      expirationTime: payload.exp,
    });
  }

  public toTokenPayload(): JWTPayload {
    return {
      sub: this.id,
      ref: this.employeeReference,
      org: this.organizationReference,
      rls: this.roles,
      rl: this.roleReferences,
      prms: this.permissions,
      seg: this.segmentReference,
      oorg: this.originalOrganizationReference,
      osub: this.originalId,
      oref: this.originalEmployeeReference,
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
  public hasRoles(validateRoles: string | string[]): boolean {
    if (typeof validateRoles === "string") {
      return this.hasRole(validateRoles);
    }
    return validateRoles.some((role) => this.hasRole(role));
  }

  /**
   * Get current role reference
   * (only the first role is returned for now, as we are not using multiple roles yet)
   * @returns role reference
   */
  public getRoleReference(): string {
    return this.roleReferences[0];
  }

  /**
   * Check if user has permission to perform an action
   * @param permissionCode - permission code to check
   * @returns boolean
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async hasPermission(permissionCode: string): Promise<boolean> {
    const definition = await JWTUser.getPermissionDefinition(permissionCode);
    const checkBitmask = BitmaskUtils.encodeFromPosition(definition.position);
    const permissionsBitmask = BitmaskUtils.decodeFromBase64(this.permissions);
    return BitmaskUtils.checkBitmask(permissionsBitmask, checkBitmask);
  }

  /**
   * Throws an error if the user does not have the required permission
   * @param permissionCode
   * @throws {NoPermissionError}
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async validatePermission(permissionCode: string): Promise<void> {
    const hasPermission = await this.hasPermission(permissionCode);
    if (!hasPermission) {
      throw new NoPermissionError([permissionCode]);
    }
  }

  /**
   * Check if user has all permissions to perform an action
   * @param permissionCodes - permission codes to check
   * @returns boolean
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async hasEveryPermission(permissionCodes: string[]): Promise<boolean> {
    const permissionsNotMet: string[] = [];
    for (const permissionCode of permissionCodes) {
      const hasPermission = await this.hasPermission(permissionCode);
      if (!hasPermission) {
        permissionsNotMet.push(permissionCode);
      }
    }
    return permissionsNotMet.length === 0;
  }

  /**
   * Throws an error if the user does not have all permissions
   * @param permissionCode
   * @throws {NoPermissionError}
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async validateEveryPermission(
    permissionCodes: string[]
  ): Promise<void> {
    const permissionsNotMet: string[] = [];
    for (const permissionCode of permissionCodes) {
      const hasPermission = await this.hasPermission(permissionCode);
      if (!hasPermission) {
        permissionsNotMet.push(permissionCode);
      }
    }
    if (permissionsNotMet.length > 0) {
      throw new NoPermissionError(permissionsNotMet);
    }
  }

  /**
   * Check if user has at least one permission
   * @param permissionCodes - permission codes to check
   * @returns boolean
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async hasSomePermission(permissionCodes: string[]): Promise<boolean> {
    for (const permissionCode of permissionCodes) {
      const hasPermission = await this.hasPermission(permissionCode);
      if (hasPermission) {
        return true;
      }
    }
    return false;
  }

  /**
   * Throws an error if the user does not have at least one of the permissions
   * @param permissionCode
   * @throws {NoPermissionError}
   * @throws {PermissionDefinitionNotFound}
   * @throws {PermissionServiceNotInstantiated}
   */
  public async validateSomePermission(
    permissionCodes: string[]
  ): Promise<void> {
    const hasSomePermission = await this.hasSomePermission(permissionCodes);
    if (!hasSomePermission) {
      throw new NoPermissionError(permissionCodes);
    }
  }

  public isImpersonating(): boolean {
    return this.id !== this.originalId;
  }

  // To check if it's not impersonating and is Lara Service Account. This should be change to check the
  // JWT type instead.
  public isServiceAccount(): boolean {
    return (
      !this.isImpersonating() &&
      this.originalEmployeeReference === "0" &&
      this.originalOrganizationReference === "lara"
    );
  }
}
