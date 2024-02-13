import { EditableAndNullableField, JustEditableField } from "./types";

function id<FieldType extends unknown, EditionType extends unknown>(
  param: EditionType
): FieldType {
  return param as unknown as FieldType;
}
function idAsync<FieldType extends unknown, EditionType extends unknown>(
  param: EditionType
): Promise<FieldType> {
  return param as Promise<FieldType>;
}

export function keepOrUpdate<
  FieldType extends unknown,
  EditionType extends unknown
>(
  defined: FieldType,
  value: EditableAndNullableField<EditionType>,
  formatter: (value: EditionType) => FieldType = id
): FieldType | null {
  if (value === undefined) return defined;

  if (value === null) return null;

  return formatter(value);
}

export function keepOrUpdateAsync<
  FieldType extends unknown,
  EditionType extends unknown
>(
  defined: FieldType,
  value: EditableAndNullableField<EditionType>,
  formatter: (value: EditionType) => Promise<FieldType> = idAsync
): Promise<FieldType | null> {
  if (value === undefined) return Promise.resolve(defined);

  if (value === null) return Promise.resolve(null);

  return formatter(value);
}
