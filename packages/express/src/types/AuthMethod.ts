// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;

type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never;
  }[keyof T],
  string
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverridableStringUnion<T extends string | number, U = {}> =
  GenerateStringUnion<Overwrite<Record<T, true>, U>>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthMethodsOverride {}

export type AuthMethod = OverridableStringUnion<
  "api-key" | "bearer-token" | "basic",
  AuthMethodsOverride
>;
