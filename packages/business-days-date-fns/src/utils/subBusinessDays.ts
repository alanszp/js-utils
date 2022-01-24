import { toInteger } from "lodash";
import { addBusinessDays } from "./addBusinessDays";
import { requiredArgs } from "./requiredArgs";

export function subBusinessDays(nonBusinessDays: Date[], dirtyDate: Date | number, dirtyAmount: number): Date {
  // eslint-disable-next-line prefer-rest-params
  requiredArgs(2, [dirtyDate, dirtyAmount]);
  const amount = toInteger(dirtyAmount);
  return addBusinessDays(nonBusinessDays, dirtyDate, -amount);
}
