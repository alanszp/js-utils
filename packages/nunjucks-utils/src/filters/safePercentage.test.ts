import { safePercentage } from "./safePercentage";

describe("safePercentage", () => {
  it.each([
    { numberArray: "2023,01,01", toExpected: [] },
    { numberArray: { asd: "test" }, toExpected: [] },
    { numberArray: ["1", 1, "asd"], toExpected: [] },
    { numberArray: ["1", 1, 0, null], toExpected: ["50%", "50%", "0%", "0%"] },
    { numberArray: ["1", 1, 0, undefined], toExpected: [] },
    { numberArray: [1], toExpected: ["100%"] },
    { numberArray: [1, 1, 1, 1], toExpected: ["25%", "25%", "25%", "25%"] },
    {
      numberArray: ["1", "1", "1", "1"],
      fractionDigits: 1,
      toExpected: ["25%", "25%", "25%", "25%"],
    },
    { numberArray: [1, 1, 1], toExpected: ["33%", "33%", "34%"] },
    { numberArray: [10, 10, 10], suffix: "", toExpected: ["33", "33", "34"] },
    {
      numberArray: [1, 1, 1],
      fractionDigits: 2,
      toExpected: ["33,33%", "33,33%", "33,34%"],
    },
    {
      numberArray: [1, 1, 1],
      locale: "en",
      fractionDigits: 1,
      toExpected: ["33.3%", "33.3%", "33.4%"],
    },
    {
      numberArray: [0.1, 0.2, 0.3],
      fractionDigits: 2,
      toExpected: ["16,67%", "33,33%", "50%"],
    },
    {
      numberArray: [1, 1, 1, 0],
      locale: "en",
      fractionDigits: 1,
      toExpected: ["33.3%", "33.3%", "33.4%", "0%"],
    },
    {
      numberArray: [11, 20, 8, 1, 0],
      locale: "en",
      fractionDigits: 0,
      toExpected: ["28%", "50%", "20%", "2%", "0%"],
    },
    {
      numberArray: [11, 20, 8, 0, 1],
      locale: "en",
      fractionDigits: 0,
      toExpected: ["28%", "50%", "20%", "0%", "2%"],
    },

    {
      numberArray: [50, 50, 0, 1],
      locale: "en",
      fractionDigits: 0,
      toExpected: ["50%", "49%", "0%", "1%"],
    },
  ])(
    "when given $numberArray with locale $locale, fractionDigits $fractionDigits and suffix $suffix should returns: $toExpected",
    ({ numberArray, locale, fractionDigits, suffix, toExpected }) => {
      expect(
        safePercentage(numberArray, locale, fractionDigits, suffix)
      ).toEqual(toExpected);
    }
  );
});
