import isFunction, { isArray } from "lodash";
import LRUCache from "lru-cache";
import { Options as CacheOptions } from "lru-cache";
import { addBusinessDays } from "./addBusinessDays";
import { subBusinessDays } from "./subBusinessDays";
import { differenceInBusinessDays } from "./differenceInBusinessDays";
import {
  wrapperDateAndNumberNonBusinessDays,
  wrapperDateNonBusinessDays,
} from "./wrapperNonBusinessDays";
import { isNonBusinessDay } from "./isNonBusinessDay";
import { isBusinessDay } from "./isBusinessDay";
import { buildNonBusinessDaysCache } from "../cache";

export type WithNonBusinessDaysOutput<IdentifyObject> = {
  addBusinessDays: (
    dirtyDate: Date | number,
    dirtyAmount: number,
    identify?: IdentifyObject
  ) => Promise<Date> | Date;
  subBusinessDays: (
    dirtyDate: Date | number,
    dirtyAmount: number,
    identify?: IdentifyObject
  ) => Promise<Date> | Date;
  differenceInBusinessDays: (
    dirtyDate: Date | number,
    dirtyAmount: number,
    identify?: IdentifyObject
  ) => Promise<number> | number;
  isNonBusinessDay: (
    date: Date,
    identify?: IdentifyObject
  ) => Promise<boolean> | boolean;
  isBusinessDay: (
    date: Date,
    identify?: IdentifyObject
  ) => Promise<boolean> | boolean;
  cache: LRUCache<string, Promise<Date[]>>;
};

export function withNonBusinessDays<Options>(
  fetchStrategy: ((opts: Options) => Promise<Date[]>) | Date[],
  cacheOpts?: CacheOptions<string, Promise<Date[]>> & {
    serializeOptions?: (opts: Options) => string;
  }
): WithNonBusinessDaysOutput<Options> {
  const { serializeOptions, ...opts } = cacheOpts || {};

  if (!isFunction(fetchStrategy) && !isArray(fetchStrategy)) {
    throw new Error(
      "You must send a function for fetchStrategy or a list of dates"
    );
  }

  const cache = buildNonBusinessDaysCache(opts);

  return {
    addBusinessDays: wrapperDateAndNumberNonBusinessDays(
      cache,
      fetchStrategy,
      addBusinessDays,
      serializeOptions
    ),
    differenceInBusinessDays: wrapperDateAndNumberNonBusinessDays(
      cache,

      fetchStrategy,
      differenceInBusinessDays,
      serializeOptions
    ),
    subBusinessDays: wrapperDateAndNumberNonBusinessDays(
      cache,
      fetchStrategy,
      subBusinessDays,
      serializeOptions
    ),
    isNonBusinessDay: wrapperDateNonBusinessDays(
      cache,
      fetchStrategy,
      isNonBusinessDay,
      serializeOptions
    ),
    isBusinessDay: wrapperDateNonBusinessDays(
      cache,
      fetchStrategy,
      isBusinessDay,
      serializeOptions
    ),
    cache,
  };
}
