export type Assignable<Target, Source> = {
  [K in keyof Target & keyof Source as Source[K] extends Target[K]
    ? K
    : never]: Target[K];
};

export function assignKey<
  Target extends Record<string | number | symbol, unknown>,
  Source extends Record<string | number | symbol, unknown>,
  Key extends keyof Assignable<Target, Source>
>(
  target: Target,
  source: Source,
  key: Key,
  defaultValue?: Assignable<Target, Source>[Key]
): void {
  if (source[key]) {
    target[key] = source[key] as Assignable<Target, Source>[Key];
    return;
  }

  if (defaultValue) {
    target[key] = defaultValue;
  }
}

export function assignKeys<
  Target extends Record<string | number | symbol, unknown>,
  Source extends Record<string | number | symbol, unknown>
>(
  target: Target,
  source: Source,
  keys: (keyof Assignable<Target, Source>)[]
): void {
  keys.forEach((key) => {
    assignKey(target, source, key);
  });
}
