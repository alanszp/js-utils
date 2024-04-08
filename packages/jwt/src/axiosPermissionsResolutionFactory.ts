import { createAxios } from "@alanszp/axios-node";
import { Permission } from "./types";
import { PermissionServiceRequestError } from "./errors/PermissionServiceRequestError";
import { ListResult } from "@alanszp/core";
import { ILogger } from "@alanszp/logger";

export type PermissionsResolutionFunction = (
  page: number,
  pageSize: number
) => Promise<ListResult<Permission>>;

async function makeRequest<T>(
  logger: ILogger,
  axios: ReturnType<typeof createAxios>,
  baseURL: string,
  accessToken: string,
  method: "GET",
  url: string,
  params?: Record<string, unknown>,
  retries: number = 5
): Promise<T> {
  try {
    const request = await axios.request<T>({
      baseURL,
      url,
      method,
      params,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return request.data;
  } catch (error: unknown) {
    if (retries > 0) {
      logger.debug("auth.permission_service.make_request.retry", {
        retriesLeft: retries,
      });
      const response = await makeRequest<T>(
        logger,
        axios,
        baseURL,
        accessToken,
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

export function axiosPermissionsResolutionFactory(
  baseUrl: string,
  accessToken: string,
  logger: ILogger
): () => PermissionsResolutionFunction {
  const axios = createAxios();
  return function axiosPermissionsResolution() {
    return async function getPermissionsPageFromApi(
      page: number = 1,
      pageSize = 500
    ): Promise<ListResult<Permission>> {
      return makeRequest<ListResult<Permission>>(
        logger,
        axios,
        baseUrl,
        accessToken,
        "GET",
        "/lara/v1/permissions",
        { page, pageSize }
      );
    };
  };
}
