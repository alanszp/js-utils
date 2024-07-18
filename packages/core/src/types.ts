export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type RequiredNull<T> = {
  [P in keyof T]: null;
};

export type Ensure<T, K extends keyof T> = T & RequiredNotNull<Pick<T, K>>;

export type EnsureNull<T, K extends keyof T> = T & RequiredNull<Pick<T, K>>;
