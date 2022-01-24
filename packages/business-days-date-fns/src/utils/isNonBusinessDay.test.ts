import { isNonBusinessDay } from "./isNonBusinessDay";

describe("isNonBusinessDay", () => {
  it("should return is business day", () => {
    const result = isNonBusinessDay([new Date("2022-01-01"), new Date("2022-01-02")], new Date("2022-01-01"));

    expect(result).toBe(true);
  });

  it("should return is not a business day", () => {
    const result = isNonBusinessDay([new Date("2022-01-01"), new Date("2022-01-02")], new Date("2022-01-03"));

    expect(result).toBe(false);
  });
});
