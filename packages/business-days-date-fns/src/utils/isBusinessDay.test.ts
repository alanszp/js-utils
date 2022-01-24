import assert from "assert";
import { parse } from "date-fns";
import { isBusinessDay } from "./isBusinessDay";

describe("isNonBusinessDay", () => {
  it("should return is non business day", () => {
    const result = isBusinessDay(
      [new Date("2022-01-01"), new Date("2022-01-02")],
      new Date("2022-01-01")
    );

    expect(result).toBeFalsy();
  });

  it("should return is a business day", () => {
    const result = isBusinessDay(
      [new Date("2022-01-01"), new Date("2022-01-02")],
      new Date("2022-01-03")
    );

    expect(result).toBeTruthy();
  });

  it("should work properly using hh:mm:ss", () => {
    const mondayLate = isBusinessDay(
      [],
      parse("2022-01-24T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())
    );
    const fridayLate = isBusinessDay(
      [parse("2022-01-28T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())],
      parse("2022-01-28T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())
    );

    expect(mondayLate).toBeTruthy();
    expect(fridayLate).toBeTruthy();
  });

  it("throws TypeError exception if passed less than 2 arguments", () => {
    try {
      // @ts-ignore
      isBusinessDay([new Date("2022-01-01"), new Date("2022-01-02")]);

      assert.throws(isBusinessDay.bind(null), TypeError);
      assert.throws(isBusinessDay.bind(null, 1), TypeError);
    } catch {}
  });
});
