export type OrderDirection = "ASC" | "DESC";

export const ORDER_DIRECTIONS = ["ASC", "DESC"];

export interface Orderable<T extends string | number | symbol = "id"> {
  orderBy: T;
  orderDirection: OrderDirection;
}

export function getOrderObject<
  K extends string | number | symbol,
  T extends Orderable<K>
>(object: T) {
  return {
    order: {
      [object.orderBy]: object.orderDirection,
    },
  };
}
