import LRUCache, { Options } from "lru-cache";

const oneDay = 1000 * 60 * 60 * 24;

const DEFAULT_OPTIONS: Options<string, Promise<Date[]>> = {
  max: 300,
  maxAge: oneDay,
  stale: true,
  updateAgeOnGet: true,
};

export const buildNonBusinessDaysCache = (
  options?: Options<string, Promise<Date[]>>
) => new LRUCache<string, Promise<Date[]>>(options ?? DEFAULT_OPTIONS);
