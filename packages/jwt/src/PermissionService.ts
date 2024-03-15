import { ILogger } from "@alanszp/logger";
import { createAxios, createAxiosWithTrace } from "@alanszp/axios-node";
import { Permission } from "./types";
import { PermissionServiceRequestError } from "./errors/PermissionServiceRequestError";
import { ListResult } from "@alanszp/core";
import NodeCache from "node-cache";

const permissionsCache = new NodeCache({
  stdTTL: 1 * 60 * 60, // 1 hour
});

export type AxiosInstance =
  | ReturnType<typeof createAxios>
  | ReturnType<typeof createAxiosWithTrace>;

export class PermissionService {
  readonly #baseUrl: string;

  readonly #accessToken: string;

  readonly #axios: ReturnType<typeof createAxios>;

  #permissionsPreheatedSuccessfully: Promise<void> = Promise.resolve();

  private readonly logger: ILogger;

  constructor(logger: ILogger, baseUrl: string, accessToken: string) {
    this.logger = logger;
    this.#axios = createAxios();
    this.#baseUrl = baseUrl;
    this.#accessToken = accessToken;
  }

  private async makeRequest<T>(
    method: "GET",
    url: string,
    params?: Record<string, unknown>,
    retries: number = 5
  ): Promise<T> {
    try {
      const request = await this.#axios.request<T>({
        baseURL: this.#baseUrl,
        url,
        method,
        params,
        headers: {
          authorization: `Bearer ${this.#accessToken}`,
        },
      });

      return request.data;
    } catch (error: unknown) {
      if (retries > 0) {
        this.logger.debug("auth.permission_service.make_request.retry", {
          retriesLeft: retries,
        });
        const response = await this.makeRequest<T>(
          method,
          url,
          params,
          retries - 1
        );
        return response;
      }
      throw new PermissionServiceRequestError(error);
    }
  }

  private async getPermissionsPage(
    page: number = 1,
    pageSize = 500
  ): Promise<ListResult<Permission>> {
    return this.makeRequest<ListResult<Permission>>(
      "GET",
      "/lara/v1/permissions",
      { page, pageSize }
    );
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

  /**
   * Retrieve the permissions definitions
   * @returns {Promise<Permission[]>}
   */
  public async getPermissions(checkCache = true): Promise<Permission[]> {
    const cached: Permission[] | undefined = permissionsCache.get("all");
    if (checkCache && cached) {
      this.logger.debug("auth.permission_service.get_permissions.cache_hit");
      return cached;
    }
    this.logger.debug("auth.permission_service.get_permissions.cache_miss");

    const permissions = this.getAllPagesFromPaginatedRequest(
      this.getPermissionsPage
    );

    permissionsCache.set("all", permissions);

    return permissions;
  }

  public async isPermissionsCacheReady(): Promise<boolean> {
    await this.#permissionsPreheatedSuccessfully;
    return permissionsCache.has("all");
  }

  /**
   * Populate the permissions cache
   * @todo Implement retry strategy
   */
  public reloadPermissionCache() {
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
  }
}
