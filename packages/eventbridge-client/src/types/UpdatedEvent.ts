// eslint-disable-next-line @typescript-eslint/ban-types
type PropertyKeys<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type UpdatedIdentifiers<
  Entity,
  Identifiers extends keyof PropertyKeys<Entity>,
  PartialEntity = Pick<PropertyKeys<Entity>, Identifiers>
> = {
  [K in keyof PartialEntity]: PartialEntity[K];
};

type UpdatedFields<
  Entity,
  Identifiers extends keyof PropertyKeys<Entity>,
  PartialEntity = Omit<PropertyKeys<Entity>, Identifiers>
> = {
  [K in keyof PartialEntity]?: PartialEntity[K];
};

export type CreatedEvent<
  Entity,
  Identifiers extends keyof PropertyKeys<Entity>
> = UpdatedFields<Entity, Identifiers>;

export type UpdatedEvent<
  Entity,
  Identifiers extends keyof PropertyKeys<Entity>
> = UpdatedFields<Entity, Identifiers> &
  UpdatedIdentifiers<Entity, Identifiers> & {
    _previousValues?: UpdatedFields<Entity, Identifiers>;
    modifiedKeys: (keyof UpdatedFields<Entity, Identifiers>)[];
  };

export type DeletedEvent<
  Entity,
  Identifiers extends keyof PropertyKeys<Entity>
> = UpdatedIdentifiers<Entity, Identifiers>;
