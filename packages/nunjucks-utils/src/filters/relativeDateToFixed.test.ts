import "reflect-metadata";
import {
  add,
  endOfQuarter,
  endOfYear,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  sub,
} from "date-fns";
import { relativeDateToFixed } from "./relativeDateToFixed";

describe("relativeDateToFixed", () => {
  it.each([
    { dateInput: `2023-01-01`, toExpected: "2023-01-01" },
    { dateInput: `asdasd asdas`, toExpected: "asdasd asdas" },
    { dateInput: `2023-16-01`, toExpected: "2023-16-01" },
    {
      dateInput: "now",
      toExpected: format(new Date(), "yyyy-MM-dd"),
    },
    {
      dateInput: " + 2 d",
      toExpected: format(add(new Date(), { days: 2 }), "yyyy-MM-dd"),
    },
    {
      dateInput: "+ 2 d:eoy",
      toExpected: format(endOfYear(add(new Date(), { days: 2 })), "yyyy-MM-dd"),
    },
    {
      dateInput: "+2d:soy",
      toExpected: format(
        startOfYear(add(new Date(), { days: 2 })),
        "yyyy-MM-dd"
      ),
    },
    {
      dateInput: "now:soy",
      toExpected: format(startOfYear(new Date()), "yyyy-MM-dd"),
    },
    {
      dateInput: "now:som",
      toExpected: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    },
    {
      dateInput: "now:eoq",
      toExpected: format(endOfQuarter(new Date()), "yyyy-MM-dd"),
    },
    {
      dateInput: "-2q",
      toExpected: format(sub(new Date(), { months: 6 }), "yyyy-MM-dd"),
    },
    {
      dateInput: "- 2 years",
      toExpected: format(sub(new Date(), { years: 2 }), "yyyy-MM-dd"),
    },
    {
      dateInput: "- 2 years:soy",
      toExpected: format(
        startOfYear(sub(new Date(), { years: 2 })),
        "yyyy-MM-dd"
      ),
    },
    {
      dateInput: "-2y:soy",
      toExpected: format(
        startOfYear(sub(new Date(), { years: 2 })),
        "yyyy-MM-dd"
      ),
    },
    {
      dateInput: "now:soy",
      toExpected: format(startOfYear(new Date()), "yyyy-MM-dd"),
    },
    {
      dateInput: "now:soy",
      toExpected: format(startOfYear(new Date()), "yyyy-MM-dd"),
    },
    {
      dateInput: "-1m:soq",
      toExpected: format(
        startOfQuarter(sub(new Date(), { months: 1 })),
        "yyyy-MM-dd"
      ),
    },
  ])(
    "when given $dateInput should returns value from: $fromExpected and to: $toExpected",
    ({ dateInput, toExpected }) => {
      expect(relativeDateToFixed(dateInput)).toEqual(toExpected);
    }
  );
});
