export function assignKey<CommonInterface>(
  target: CommonInterface,
  source: CommonInterface,
  key: keyof CommonInterface
) {
  if (source[key]) {
    // eslint-disable-next-line no-param-reassign
    target[key] = source[key];
  }
}

export function assignKeys<CommonInterface>(
  target: CommonInterface,
  source: CommonInterface,
  keys: (keyof CommonInterface)[]
) {
  keys.forEach((key) => {
    assignKey(target, source, key);
  });
}
