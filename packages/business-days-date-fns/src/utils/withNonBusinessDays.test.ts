import assert from "assert";
import { values } from "lodash";
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
    const { isBusinessDay } = withNonBusinessDays<undefined>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    await isBusinessDay(new Date("2022-01-18"));
    await isBusinessDay(new Date("2022-01-20"));
    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async without identify should call fetchStrategy but just one time, second go to cache if the promise is resolved before the second call", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(() => Promise.resolve(mockNBD));

    const { isBusinessDay } = withNonBusinessDays<undefined>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"));
    const promise2 = isBusinessDay(new Date("2022-01-18"));

    await Promise.all([promise1, promise2]);

    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async without identify should call fetchStrategy but just one time, second go to cache, even if the promise is resolved after the second call", async () => {
    const mockFetchStrategy = jest.fn();
    let shouldResolve = false;

    function verifyResolve(resolve: (val: unknown) => void) {
      setTimeout(() => {
        if (shouldResolve) {
          resolve(mockNBD);
        } else {
          verifyResolve(resolve);
        }
      }, 0);
    }

    mockFetchStrategy.mockImplementation(() => new Promise(verifyResolve));

    const { isBusinessDay } = withNonBusinessDays<undefined>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"));
    const promise2 = isBusinessDay(new Date("2022-01-19"));

    shouldResolve = true;

    expect(await Promise.all([promise1, promise2])).toEqual([true, false]);
    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async should call fetchStrategy but just one time, second go to cache if the promise is resolved before the second call", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation((obj: { number: number }) =>
      Promise.resolve(mockNBD),
    );

    const { isBusinessDay } = withNonBusinessDays<{ number: number }>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"), { number: 1 });
    const promise2 = isBusinessDay(new Date("2022-01-18"), { number: 1 });

    await Promise.all([promise1, promise2]);

    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async should call fetchStrategy but just one time, second go to cache, even if the promise is resolved after the second call", async () => {
    const mockFetchStrategy = jest.fn();
    let shouldResolve = false;

    function verifyResolve(resolve: (val: unknown) => void) {
      setTimeout(() => {
        if (shouldResolve) {
          resolve(mockNBD);
        } else {
          verifyResolve(resolve);
        }
      }, 0);
    }

    mockFetchStrategy.mockImplementation(
      (obj: { number: number }) => new Promise(verifyResolve),
    );

    const { isBusinessDay } = withNonBusinessDays<{ number: number }>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"), { number: 1 });
    const promise2 = isBusinessDay(new Date("2022-01-19"), { number: 1 });

    shouldResolve = true;

    expect(await Promise.all([promise1, promise2])).toEqual([true, false]);
    expect(mockFetchStrategy).toBeCalledTimes(1);
  });

  it("bootstrapping async should call fetchStrategy two times if the promise is resolved before the second call", async () => {
    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation((obj: { number: number }) =>
      Promise.resolve(mockNBD),
    );

    const { isBusinessDay } = withNonBusinessDays<{ number: number }>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"), { number: 1 });
    const promise2 = isBusinessDay(new Date("2022-01-18"), { number: 2 });

    await Promise.all([promise1, promise2]);

    expect(mockFetchStrategy).toBeCalledTimes(2);
  });

  it("bootstrapping async should call fetchStrategy two times even if the promise is resolved after the second call", async () => {
    let shouldResolve1 = false;

    function verifyResolve1(resolve: (val: unknown) => void) {
      setTimeout(() => {
        if (shouldResolve1) {
          resolve(mockNBD);
        } else {
          verifyResolve1(resolve);
        }
      }, 0);
    }

    let shouldResolve2 = false;

    function verifyResolve2(resolve: (val: unknown) => void) {
      setTimeout(() => {
        if (shouldResolve2) {
          resolve(mockNBD);
        } else {
          verifyResolve2(resolve);
        }
      }, 0);
    }

    const mockFetchStrategy = jest.fn();
    mockFetchStrategy.mockImplementation(
      (obj: { number: number }) =>
        new Promise(obj.number == 1 ? verifyResolve1 : verifyResolve2),
    );

    const { isBusinessDay } = withNonBusinessDays<{ number: number }>(
      mockFetchStrategy,
      {
        serializeOptions: (obj) => JSON.stringify(obj),
      },
    );

    const promise1 = isBusinessDay(new Date("2022-01-18"), { number: 1 });
    const promise2 = isBusinessDay(new Date("2022-01-19"), { number: 2 });

    shouldResolve1 = true;
    shouldResolve2 = true;

    expect(await Promise.all([promise1, promise2])).toEqual([true, false]);
    expect(mockFetchStrategy).toBeCalledTimes(2);
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

  it("should export cache correctly", () => {
    const { cache } = withNonBusinessDays(mockNBD);
    const date = new Date();

    cache.set("key-name", Promise.resolve([date]));

    expect(cache.get("key-name")).toEqual(date);
  });
});
