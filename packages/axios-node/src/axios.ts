import AxiosGlobal, { AxiosError } from "axios";
import { AsyncLocalStorage } from "async_hooks";
import { NetworkRequestError } from "./errors/NetworkRequestError";
import { Non200ResponseError } from "./errors/Non200ResponseError";
import { GenericError } from "./errors/GenericError";

export interface SharedContext {
  lifecycleId: string;
  lifecycleChain: string;
}

export const isAxiosError = AxiosGlobal.isAxiosError.bind(AxiosGlobal);

function mapAxiosErrorToRequestError<T>(error: any) {
  if (error.response) {
    return Promise.reject(new Non200ResponseError<T>(error as AxiosError<T>));
  }

  if (error.request) {
    return Promise.reject(new NetworkRequestError(error as AxiosError<T>));
  }

  Promise.reject(new GenericError(error));
}

function id<T>(a: T): T {
  return a;
}

export function createAxios() {
  const axios = AxiosGlobal.create();
  axios.interceptors.request.use(id, mapAxiosErrorToRequestError);
  axios.interceptors.response.use(id, mapAxiosErrorToRequestError);
  return axios;
}

export function createAxiosWithTrace(
  requestSharedContext: AsyncLocalStorage<SharedContext>
) {
  const axios = AxiosGlobal.create();

  axios.interceptors.request.use((config) => {
    const context = requestSharedContext.getStore();
    if (!context) return config;

    return {
      ...config,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        "x-lifecycle-id": context.lifecycleId,
        "x-lifecycle-chain": context.lifecycleChain,
        ...config.headers,
      },
    };
  }, mapAxiosErrorToRequestError);

  axios.interceptors.response.use(id, mapAxiosErrorToRequestError);

  return axios;
}
