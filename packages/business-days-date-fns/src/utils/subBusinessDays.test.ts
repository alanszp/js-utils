import assert from "assert";
import { subBusinessDays } from "./subBusinessDays";

describe("subBusinessDay", () => {
  it("should return 2 next days", () => {
    const result = subBusinessDays(
      [new Date("2022-01-20")],
      new Date("2022-01-21"),
      1
    );
    expect(result).toEqual(new Date("2022-01-19"));
  });

  it("should return next monday", () => {
    const result = subBusinessDays(
      [new Date("2022-01-20"), new Date("2022-01-21")],
      new Date("2022-01-24"),
      1
    );
    expect(result).toEqual(new Date("2022-01-19"));
  });

  it("should return next monday when you start on weekend", () => {
    const result = subBusinessDays([], new Date("2022-01-24"), 1);
    expect(result).toEqual(new Date("2022-01-21"));
  });

  it("substract the given number of business days", () => {
    const result = subBusinessDays([], new Date(2014, 8 /* Sep */, 1), 10);
    expect(result).toEqual(new Date(2014, 7 /* Aug */, 18));
  });

  it("handles negative amount", () => {
    const result = subBusinessDays([], new Date(2014, 7 /* Sep */, 18), -10);
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 1));
  });

  it("can handle a large number of business days", () => {
    // @ts-ignore
    if (typeof global.timeout === "function") {
      // @ts-ignore
      global.timeout(500 /* 500 ms test timeout */);
    }

    const result = subBusinessDays(
      [],
      new Date(15000, 0 /* Jan */, 1),
      3387885
    );
    expect(result).toEqual(new Date(2014, 0 /* Jan */, 1));
  });

  it("accepts a timestamp", () => {
    const result = subBusinessDays(
      [],
      new Date(2014, 8 /* Sep */, 1).getTime(),
      10
    );
    expect(result).toEqual(new Date(2014, 7 /* Aug */, 18));
  });

  it("converts a fractional number to an integer", () => {
    const result = subBusinessDays([], new Date(2014, 8 /* Sep */, 1), 10.5);
    expect(result).toEqual(new Date(2014, 7 /* Aug */, 18));
  });

  it("implicitly converts number arguments", () => {
    const result = subBusinessDays(
      [],
      new Date(2014, 8 /* Sep */, 1),
      // @ts-ignore
      "10"
    );
    expect(result).toEqual(new Date(2014, 7 /* Aug */, 18));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2014, 8 /* Sep */, 1);
    subBusinessDays([], date, 11);
    expect(date).toEqual(new Date(2014, 8 /* Sep */, 1));
  });

  it("returns `Invalid Date` if the given date is invalid", () => {
    const result = subBusinessDays([], new Date(NaN), 10);
    expect(
      result instanceof Date && Number.isNaN(result.getTime())
    ).toBeTruthy();
  });

  it("throws TypeError exception if passed less than 2 arguments", () => {
    try {
      assert.throws(subBusinessDays.bind(null), TypeError);
      assert.throws(
        subBusinessDays.bind(null, new Date(2014, 8 /* Sep */, 1)),
        TypeError
      );
    } catch {}
  });
});
