import assert from "assert";
import { withNonBusinessDays } from "./withNonBusinessDays";

const mockNBD = [new Date("2022-01-19"), new Date("2022-01-20")];
const mockSerializer = jest.fn();

describe("withNonBusinessDays", () => {
  it("bootstrapping sync should return fns", () => {
    const {
      addBusinessDays,
      subBusinessDays,
      isBusinessDay,
      isNonBusinessDay,
      differenceInBusinessDays,
    } = withNonBusinessDays([new Date("2022-01-01"), new Date("2022-01-10")]);

    expect(typeof addBusinessDays).toBe("function");
    expect(typeof subBusinessDays).toBe("function");
    expect(typeof isBusinessDay).toBe("function");
    expect(typeof isNonBusinessDay).toBe("function");
    expect(typeof differenceInBusinessDays).toBe("function");
  });

  it("bootstrapping async should return fns and call serializer", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.resolve(mockNBD));

    const {
      addBusinessDays,
      subBusinessDays,
      isBusinessDay,
      isNonBusinessDay,
      differenceInBusinessDays,
    } = withNonBusinessDays(mockFetchStrategy, {
      serializeOptions: mockSerializer,
    });

    expect(typeof addBusinessDays).toBe("function");
    expect(typeof subBusinessDays).toBe("function");
    expect(typeof isBusinessDay).toBe("function");
    expect(typeof isNonBusinessDay).toBe("function");
    expect(typeof differenceInBusinessDays).toBe("function");

    await addBusinessDays(new Date(), 1, { month: 1 });

    expect(mockSerializer).toHaveBeenCalledWith({ month: 1 });
    expect(mockFetchStrategy).toHaveBeenCalled();
  });

  it("bootstrapping async addBusinessDays", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.resolve(mockNBD));
    const { addBusinessDays } = withNonBusinessDays(mockFetchStrategy, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    const result = await addBusinessDays(new Date("2022-01-18"), 1);
    expect(result).toEqual(new Date("2022-01-21"));
  });

  it("bootstrapping async should call fetchStrategy but just one time, second go to cache", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.resolve(mockNBD));
    const { isBusinessDay } = withNonBusinessDays(mockFetchStrategy, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    await isBusinessDay(new Date("2022-01-18"));
    await isBusinessDay(new Date("2022-01-18"));
    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async should call fetchStrategy but just one time, second go to cache if the promise is resolved before the second call", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.resolve(mockNBD));

    const { isBusinessDay } = withNonBusinessDays(mockFetchStrategy, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    const promise1 = isBusinessDay(new Date("2022-01-18"));
    const promise2 = isBusinessDay(new Date("2022-01-18"));

    await Promise.all([promise1, promise2]);

    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async should call fetchStrategy but just one time, second go to cache, even if the promise is resolved after the second call", async () => {
    const mockFetchStrategy = jest.fn();
    let resolve = false;
    mockFetchStrategy.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            if (resolve) resolve(mockNBD);
          }, 0)
        )
    );

    const { isBusinessDay } = withNonBusinessDays(mockFetchStrategy, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    const promise1 = isBusinessDay(new Date("2022-01-18"));
    const promise2 = isBusinessDay(new Date("2022-01-18"));

    resolve = true;

    await Promise.all([promise1, promise2]);

    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async throw error", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.reject());
    try {
      assert.throws(withNonBusinessDays.bind(mockFetchStrategy), TypeError);
    } catch {}
  });

  it("bootstrapping sync addBusinessDays", () => {
    const { addBusinessDays } = withNonBusinessDays(mockNBD);

    const result = addBusinessDays(new Date("2022-01-18"), 1);
    expect(result).toEqual(new Date("2022-01-21"));
  });

  it("bootstrapping should throw error for bad input", () => {
    try {
      assert.throws(withNonBusinessDays.bind(null), TypeError);
      assert.throws(withNonBusinessDays.bind(null), TypeError);
    } catch {}
  });
});
