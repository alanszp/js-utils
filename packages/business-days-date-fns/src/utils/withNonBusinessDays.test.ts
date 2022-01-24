import { withNonBusinessDays } from "./withNonBusinessDays";

const mockNBD = [new Date("2022-01-19"), new Date("2022-01-20")];

const mockPromise = () => Promise.resolve(mockNBD);

describe("withNonBusinessDays", () => {
  it("bootstraping sync should return fns", () => {
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

  it("bootstraping async should return fns", () => {
    const {
      addBusinessDays,
      subBusinessDays,
      isBusinessDay,
      isNonBusinessDay,
      differenceInBusinessDays,
    } = withNonBusinessDays(mockPromise, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    expect(typeof addBusinessDays).toBe("function");
    expect(typeof subBusinessDays).toBe("function");
    expect(typeof isBusinessDay).toBe("function");
    expect(typeof isNonBusinessDay).toBe("function");
    expect(typeof differenceInBusinessDays).toBe("function");
  });

  it("bootstraping async addBusinessDays", async () => {
    const { addBusinessDays } = withNonBusinessDays(mockPromise, {
      serializeOptions: (obj) => JSON.stringify(obj),
    });

    const result = await addBusinessDays(new Date("2022-01-18"), 1);
    expect(result).toEqual(new Date("2022-01-21"));
  });

  it("bootstraping sync addBusinessDays", () => {
    const { addBusinessDays } = withNonBusinessDays(mockNBD);

    const result = addBusinessDays(new Date("2022-01-18"), 1);
    expect(result).toEqual(new Date("2022-01-21"));
  });
});
