export interface SubscribedEvent<T> {
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

export function isSubscribedEvent<T>(
  object: unknown
): object is SubscribedEvent<T> {
  return;
}
