import assert from "assert";
import { addBusinessDays } from "./addBusinessDays";

describe("addBusinessDays", () => {
  it("should return 2 next days", () => {
    const result = addBusinessDays(
      [new Date("2022-01-20")],
      new Date("2022-01-19"),
      1
    );
    expect(result).toEqual(new Date("2022-01-21"));
  });

  it("should return next monday", () => {
    const result = addBusinessDays(
      [new Date("2022-01-20"), new Date("2022-01-21")],
      new Date("2022-01-19"),
      1
    );
    expect(result).toEqual(new Date("2022-01-24"));
  });

  it("should return next monday when you start on weekend", () => {
    const result = addBusinessDays([], new Date("2022-01-21"), 1);
    expect(result).toEqual(new Date("2022-01-24"));
  });

  // original tests

  it("adds the given number of business days", () => {
    const result = addBusinessDays([], new Date(2014, 8 /* Sep */, 1), 10);
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 15));
  });

  it("handles negative amount", () => {
    const result = addBusinessDays([], new Date(2014, 8 /* Sep */, 15), -10);
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 1));
  });

  it("returns the Monday when 1 day is added on the Friday", () => {
    expect(
      addBusinessDays([], new Date(2020, 0 /* Jan */, 10), 1) // Friday
    ).toEqual(
      new Date(2020, 0 /* Jan */, 13) // Monday
    );
  });

  it("returns the Monday when 1 day is added on the Saturday", () => {
    expect(
      addBusinessDays([], new Date(2020, 0 /* Jan */, 11), 1) // Saturday
    ).toEqual(
      new Date(2020, 0 /* Jan */, 13) // Monday
    );
  });

  it("returns the Monday when 1 day is added on the Sunday", () => {
    expect(
      addBusinessDays([], new Date(2020, 0 /* Jan */, 12), 1) // Sunday
    ).toEqual(
      new Date(2020, 0 /* Jan */, 13) // Monday
    );
  });

  it("can handle a large number of business days", () => {
    // @ts-ignore
    if (typeof global.timeout === "function") {
      // @ts-ignore
      global.timeout(500 /* 500 ms test timeout */);
    }

    const result = addBusinessDays([], new Date(2014, 0 /* Jan */, 1), 3387885);
    expect(result).toEqual(new Date(15000, 0 /* Jan */, 1));
  });

  it("accepts a timestamp", () => {
    const result = addBusinessDays(
      [],
      new Date(2014, 8 /* Sep */, 1).getTime(),
      10
    );
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 15));
  });

  it("converts a fractional number to an integer", () => {
    const result = addBusinessDays([], new Date(2014, 8 /* Sep */, 1), 10.5);
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 15));
  });

  it("implicitly converts number arguments", () => {
    // @ts-ignore
    const result = addBusinessDays([], new Date(2014, 8 /* Sep */, 1), "10");
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 15));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2014, 8 /* Sep */, 1);
    addBusinessDays([], date, 11);
    expect(date).toEqual(new Date(2014, 8 /* Sep */, 1));
  });

  it("returns `Invalid Date` if the given date is invalid", () => {
    const result = addBusinessDays([], new Date(NaN), 10);
    assert(result instanceof Date && Number.isNaN(result.getTime()));
  });

  it("throws TypeError exception if passed less than 2 arguments", () => {
    try {
      assert.throws(addBusinessDays.bind(null), TypeError);

      assert.throws(addBusinessDays.bind(null, 1), TypeError);
    } catch {}
  });

  it("starting from a weekend day should land on a weekday when reducing a divisible by 5", () => {
    const substractResult = addBusinessDays([], new Date(2019, 7, 18), -5);
    expect(substractResult).toEqual(new Date(2019, 7, 12));

    const subtractResultWeekend = addBusinessDays(
      [],
      new Date(2019, 7, 17),
      -5
    );
    expect(subtractResultWeekend).toEqual(new Date(2019, 7, 12));

    const addResult = addBusinessDays([], new Date(2019, 7, 18), 5);
    expect(addResult).toEqual(new Date(2019, 7, 23));

    const addResultWeekend = addBusinessDays([], new Date(2019, 7, 17), 5);
    expect(addResultWeekend).toEqual(new Date(2019, 7, 23));
  });
});
