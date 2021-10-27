export function assignKey<CommonInterface, Key extends keyof CommonInterface>(
  target: CommonInterface,
  source: CommonInterface,
  key: Key,
  defaultValue?: CommonInterface[Key]
): void {
  if (source[key] !== undefined) {
    target[key] = source[key];
    return;
  }

  if (defaultValue !== undefined) {
    target[key] = defaultValue;
  }
}

export function assignKeys<CommonInterface>(
  target: CommonInterface,
  source: CommonInterface,
  keys: (keyof CommonInterface)[]
): void {
  keys.forEach((key) => {
    assignKey(target, source, key);
  });
}
