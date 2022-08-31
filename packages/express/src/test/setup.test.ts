import { now } from "../helpers/now";

jest.mock("@/helpers/now");

describe("Timezones", () => {
  it("should always be UTC", () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });

  it("now() is mocked", () => {
    (now as jest.Mock).mockReturnValue(new Date("2021-01-01T12:30:43"));

    expect(now()).toEqual(new Date("2021-01-01T12:30:43"));
  });
});
