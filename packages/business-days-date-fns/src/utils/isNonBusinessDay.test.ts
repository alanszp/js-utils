import assert from "assert";
import { parse } from "date-fns";
import { isNonBusinessDay } from "./isNonBusinessDay";

describe("isNonBusinessDay", () => {
  it("should return true because is part of NBD", () => {
    const result = isNonBusinessDay(
      [new Date("2022-01-01"), new Date("2022-01-02")],
      new Date("2022-01-01")
    );

    expect(result).toBe(true);
  });

  it("should return true because weekend", () => {
    const saturday = isNonBusinessDay([], new Date("2022-01-01"));
    const sunday = isNonBusinessDay([], new Date("2022-01-02"));

    expect(saturday).toBeTruthy();
    expect(sunday).toBeTruthy();
  });

  it("should return false because are part of the week", () => {
    const monday = isNonBusinessDay([], new Date("2022-01-03"));
    const tuesday = isNonBusinessDay([], new Date("2022-01-04"));
    const wednesday = isNonBusinessDay([], new Date("2022-01-05"));
    const thursday = isNonBusinessDay([], new Date("2022-01-06"));
    const friday = isNonBusinessDay([], new Date("2022-01-07"));

    expect(monday).toBeFalsy();
    expect(tuesday).toBeFalsy();
    expect(wednesday).toBeFalsy();
    expect(thursday).toBeFalsy();
    expect(friday).toBeFalsy();
  });

  it("should work properly using hh:mm:ss", () => {
    const sundayLate = isNonBusinessDay(
      [],
      parse("2022-01-23T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())
    );
    const dayOffLate = isNonBusinessDay(
      [parse("2022-01-24T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())],
      parse("2022-01-24T23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())
    );

    expect(sundayLate).toBeFalsy();
    expect(dayOffLate).toBeFalsy();
  });

  it("should return false because is not part of is part of NBD", () => {
    const result = isNonBusinessDay(
      [new Date("2022-01-01"), new Date("2022-01-02")],
      new Date("2022-01-03")
    );

    expect(result).toBe(false);
  });

  it("throws TypeError exception if passed less than 2 arguments", () => {
    try {
      // @ts-ignore
      isNonBusinessDay([new Date("2022-01-01"), new Date("2022-01-02")]);

      assert.throws(isNonBusinessDay.bind(null), TypeError);
      assert.throws(isNonBusinessDay.bind(null, 1), TypeError);
    } catch {}
  });
});
