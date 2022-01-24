import { InternalServerError } from "@alanszp/errors";
import isArray from "lodash/isArray";
import LRUCache from "lru-cache";

export function wrapperDateAndNumberNonBusinessDays<IdentifyObject, R>(
  cacheNBD: LRUCache<string, Date[]>,
  fetchStrategy: ((opts?: IdentifyObject) => Promise<Date[]>) | Date[],
  fn: (
    nonBusinessDays: Date[],
    dirtyDate: Date | number,
    dirtyAmount: number
  ) => R,
  serializeOptions?: (opts?: IdentifyObject) => string
) {
  if (isArray(fetchStrategy)) {
    return (dirtyDate: Date | number, dirtyAmount: number) =>
      fn(fetchStrategy, dirtyDate, dirtyAmount);
  }

  return async (
    dirtyDate: Date | number,
    dirtyAmount: number,
    identify?: IdentifyObject
  ): Promise<R> => {
    const cacheIdentify = serializeOptions
      ? serializeOptions(identify)
      : JSON.stringify(identify);
    const cache = cacheNBD.get(cacheIdentify);

    let nonBusinessDays: Date[] = [];

    if (!cache) {
      try {
        nonBusinessDays = await fetchStrategy(identify);
        cacheNBD.set(cacheIdentify, nonBusinessDays);
      } catch (error: unknown) {
        throw new InternalServerError(error);
      }
    } else {
      nonBusinessDays = cache;
    }

    return fn(nonBusinessDays, dirtyDate, dirtyAmount);
  };
}

export function wrapperDateNonBusinessDays<IdentifyObject, R>(
  cacheNBD: LRUCache<string, Date[]>,
  fetchStrategy: ((opts?: IdentifyObject) => Promise<Date[]>) | Date[],
  fn: (nonBusinessDays: Date[], date: Date) => R,
  serializeOptions?: (opts?: IdentifyObject) => string
) {
  if (isArray(fetchStrategy)) {
    return (date: Date) => fn(fetchStrategy, date);
  }

  return async (date: Date, identify?: IdentifyObject): Promise<R> => {
    const cacheIdentify = serializeOptions
      ? serializeOptions(identify)
      : JSON.stringify(identify);
    const cache = cacheNBD.get(cacheIdentify);

    let nonBusinessDays: Date[] = [];

    if (!cache) {
      try {
        nonBusinessDays = await fetchStrategy(identify);
        cacheNBD.set(cacheIdentify, nonBusinessDays);
      } catch (error: unknown) {
        throw new InternalServerError(error);
      }
    } else {
      nonBusinessDays = cache;
    }

    return fn(nonBusinessDays, date);
  };
}
