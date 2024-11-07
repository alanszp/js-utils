import { ILogger } from "@alanszp/logger";
import { Permission } from "./types";
import { ListResult } from "@alanszp/core";
import { PermissionsResolutionFunction } from "./axiosPermissionsResolutionFactory";

export interface IPermissionService {
  getPermissions(): Promise<Permission[]>;

  getPermission(code: string): Promise<Permission | undefined>;
}

const DEFAULT_PERMISSIONS_REFETCH_TIMEOUT = 1000 * 60 * 60; // 1hs

export class PermissionService implements IPermissionService {
  readonly #permissionsResolutionFn: PermissionsResolutionFunction;

  #cachedPermissions: Permission[] | null;

  #cachedPermissionMap: Map<string, Permission> | null;

  #observerInterval: NodeJS.Timeout | null;

  #permissionsPreheatedSuccessfully: Promise<void>;

  private readonly logger: ILogger;

  constructor(
    logger: ILogger,
    permissionsResolutionFn: PermissionsResolutionFunction
  ) {
    this.logger = logger;
    this.#permissionsResolutionFn = permissionsResolutionFn;
    this.#cachedPermissions = null;
    this.#observerInterval = null;
    this.#cachedPermissionMap = null;
    this.#permissionsPreheatedSuccessfully = Promise.resolve();
  }

  /**
   * Retrieve all pages from a paginated {@link ListResult} request
   * @todo this could be generalized, but tricky to do so because of the binding of the fetcher function
   */
  private async getAllPagesFromPaginatedRequest<T>(
    fetcher: (page: number, pageSize: number) => Promise<ListResult<T>>,
    pageSize: number = 500
  ): Promise<T[]> {
    const fetcherBound = fetcher.bind(this);
    const acc: T[] = [];
    const firstPage = await fetcherBound(1, pageSize);
    acc.push(...firstPage.elements);
    if (firstPage.total > firstPage.pageSize) {
      const pages = Math.ceil(firstPage.total / firstPage.pageSize);
      for (let i = 2; i <= pages; i++) {
        const page = await fetcherBound(i, pageSize);
        acc.push(...page.elements);
      }
    }

    return acc;
  }

  public hasCachedPermissions(): boolean {
    return this.#cachedPermissions !== null;
  }

  /**
   * Retrieve the permissions definitions
   * @returns {Promise<Permission[]>}
   */
  public async getPermissions(checkCache = true): Promise<Permission[]> {
    if (checkCache) {
      if (this.#cachedPermissions) {
        this.logger.debug("auth.permission_service.get_permissions.cache_hit");
        return this.#cachedPermissions;
      }
      this.logger.debug("auth.permission_service.get_permissions.cache_miss");
    }

    const permissions = await this.getAllPagesFromPaginatedRequest(
      this.#permissionsResolutionFn
    );

    this.#cachedPermissions = permissions;
    const newMap = new Map();
    permissions.forEach((permission) => {
      newMap.set(permission.code, permission);
    });
    this.#cachedPermissionMap = newMap;

    return permissions;
  }

  public async getPermission(code: string): Promise<Permission | undefined> {
    if (!this.#cachedPermissionMap) {
      await this.getPermissions(false);
    }

    return this.#cachedPermissionMap?.get(code);
  }

  public async isPermissionsCacheReady(): Promise<boolean> {
    await this.#permissionsPreheatedSuccessfully;
    return this.#cachedPermissions !== null;
  }

  public reloadPermissionCache(): Promise<void> {
    this.#permissionsPreheatedSuccessfully = this.getPermissions(false)
      .then(() => {
        this.logger.debug(
          "auth.permission_service.reload_permission_cache.success"
        );
      })
      .catch((error) => {
        this.logger.error(
          "auth.permission_service.reload_permission_cache.error",
          { error }
        );
        return;
      });

    return this.#permissionsPreheatedSuccessfully;
  }

  public startPermissionObserver(
    permissionRefetchInMs: number = DEFAULT_PERMISSIONS_REFETCH_TIMEOUT
  ): void {
    this.#observerInterval = setInterval(
      () => this.reloadPermissionCache(),
      permissionRefetchInMs
    );
  }

  public stopPermissionObserver(): void {
    if (this.#observerInterval) {
      clearInterval(this.#observerInterval);
      this.#observerInterval = null;
    }
  }
}
