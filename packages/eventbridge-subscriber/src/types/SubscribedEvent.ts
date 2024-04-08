import { isArray, isNotEmpty, isObject, isString } from "class-validator";

export type EventBaseData = Record<string, unknown>;

export interface SubscribedEvent<T extends EventBaseData = EventBaseData> {
  version: string;
  id: string;
  "detail-type": string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: T & { lid: string; lch: string };
}

function isNonEmptyString(elem: unknown): elem is string {
  return isString(elem) && isNotEmpty(elem);
}

export function isSubscribedEvent<T extends EventBaseData = EventBaseData>(
  elem: unknown
): elem is SubscribedEvent<T> {
  if (!isObject(elem)) return false;
  const object = elem as Record<string, unknown>;

  return (
    isNonEmptyString(object.id) &&
    isNonEmptyString(object["detail-type"]) &&
    isNonEmptyString(object.source) &&
    isNonEmptyString(object.account) &&
    isNonEmptyString(object.time) &&
    isNonEmptyString(object.region) &&
    isArray(object.resources)
  );
}
