export type JustEditableField<T> = T | undefined;

export type EditableAndNullableField<T> = T | undefined | null;

export type EditableField<T> = T extends undefined | null
  ? EditableAndNullableField<T>
  : JustEditableField<T>;

export type EditableObject<T> = {
  [key in keyof T]: EditableField<T[key]>;
};
