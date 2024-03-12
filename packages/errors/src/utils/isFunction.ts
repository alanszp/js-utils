import { hasOwnProperty } from "./hasOwnProperty";

export function isFunction<X extends object, Y extends PropertyKey, ReturnType>(
  obj: X,
  prop: Y,
  argumentLength: number
): obj is X & Record<Y, () => ReturnType> {
  if (!hasOwnProperty(obj, prop)) {
    return false;
  }
  const propValue = obj[prop];

  return (
    typeof propValue === "function" &&
    propValue.arguments.length === argumentLength
  );
}
