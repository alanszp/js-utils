export type MandatoryCreationProperties = {};
export type MandatoryModificationProperties = {};
export type ExcludableCreationProperties = {};
export type ExcludableModificationProperties = {};

type MandatoryProperties = {
  organizationReference: string;
};

type CreatedEntityWithMandatoryProperties<T> = Partial<T> &
  MandatoryCreationProperties &
  MandatoryProperties;

type ModifiedEntityWithMandatoryProperties<T> = Partial<T> &
  MandatoryModificationProperties &
  MandatoryProperties;

export type EntityRelatedEvent<T> =
  | EntityCreatedEvent<T>
  | EntityUpdatedEvent<T>
  | EntityUpdatedEventWithPrevious<T>;

export type EntityCreatedEvent<T> = Omit<
  CreatedEntityWithMandatoryProperties<T>,
  keyof ExcludableCreationProperties
>;

export type EntityUpdatedEvent<T> = Omit<
  ModifiedEntityWithMandatoryProperties<T>,
  keyof ExcludableModificationProperties
>;

export type EntityUpdatedEventWithPrevious<T> = EntityUpdatedEvent<T> & {
  _previousValues: EntityUpdatedEvent<T>;
};
