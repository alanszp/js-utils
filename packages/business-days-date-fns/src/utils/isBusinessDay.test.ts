import assert from "assert";
import { BadInputError } from "../errors/BadInputError";
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

  it("throws TypeError exception if passed less than 2 arguments", () => {
    try {
      const result = isBusinessDay(
        [new Date("2022-01-01"), new Date("2022-01-02")],
        // @ts-ignore
        "is a test"
      );

      assert.throws(isBusinessDay.bind(null), BadInputError);

      assert.throws(isBusinessDay.bind(null, 1), BadInputError);
    } catch {}
  });
});
