import { BitmaskUtils } from "./BitmaskUtils";

describe("BitmaskUtils", () => {
  describe("encodeFromPosition", () => {
    it.each([
      { position: 0, expected: BigInt(0b1) },
      { position: 1, expected: BigInt(0b10) },
      { position: 5, expected: BigInt(0b100000) },
      { position: 10, expected: BigInt(0b10000000000) },
      { position: 15, expected: BigInt(0b1000000000000000) },
      { position: 30, expected: BigInt(0b1000000000000000000000000000000) },
      {
        position: 31,
        expected: BigInt(0b10000000000000000000000000000000),
      },
      // 32 is the maximum position for a 32-bit number - Node.js uses 32-bit numbers (when using unsigned ints), we should support more than 32 bits
      {
        position: 32,
        expected: BigInt("0b100000000000000000000000000000000"),
      },
      {
        position: 50,
        expected: BigInt(
          "0b100000000000000000000000000000000000000000000000000"
        ),
      },
      {
        position: 100,
        expected: BigInt(
          "0b10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        ),
      },
    ])(
      "Should encode a numeric position $position to a binary number",
      ({ position, expected }) => {
        const result = BitmaskUtils.encodeFromPosition(position);
        expect(result).toStrictEqual(expected);
      }
    );
  });

  describe("checkBitmask", () => {
    it.each([
      {
        bitmask: BigInt(0b1010),
        position: 3,
        expected: true,
      },
      {
        bitmask: BigInt(0b1010),
        position: 2,
        expected: false,
      },
      {
        bitmask: BigInt(0b1010),
        position: 1,
        expected: true,
      },
      {
        bitmask: BigInt(0b1010),
        position: 0,
        expected: false,
      },
    ])(
      "Should check if a bitmask has a specific bit set in position $position",
      ({ bitmask, position, expected }) => {
        const check = BitmaskUtils.encodeFromPosition(position);
        const result = BitmaskUtils.checkBitmask(bitmask, check);
        expect(result).toStrictEqual(expected);
      }
    );

    it("Should check if a bitmask has a specific bit set with big numbers", () => {
      const bitmask = BitmaskUtils.encodeFromPosition(100);
      const result = BitmaskUtils.checkBitmask(bitmask, bitmask);
      expect(result).toStrictEqual(true);
    });

    it("Should check if a bitmask has a specific bit set with enormous numbers", () => {
      const bitmask = BitmaskUtils.encodeFromPosition(500);
      const result = BitmaskUtils.checkBitmask(bitmask, bitmask);
      expect(result).toStrictEqual(true);
    });
  });

  describe("combineBitmasks", () => {
    it.each([
      {
        bitmasks: [BigInt(0b1000), BigInt(0b0100)],
        expected: BigInt(0b1100),
      },
      {
        bitmasks: [BigInt(0b1000), BigInt(0b0100), BigInt(0b0010)],
        expected: BigInt(0b1110),
      },
      {
        bitmasks: [
          BigInt(0b1000),
          BigInt(0b0100),
          BigInt(0b0010),
          BigInt(0b0001),
        ],
        expected: BigInt(0b1111),
      },
      {
        bitmasks: [
          BitmaskUtils.encodeFromPosition(100),
          BitmaskUtils.encodeFromPosition(200),
          BitmaskUtils.encodeFromPosition(300),
          BitmaskUtils.encodeFromPosition(400),
        ],
        expected:
          BitmaskUtils.encodeFromPosition(100) |
          BitmaskUtils.encodeFromPosition(200) |
          BitmaskUtils.encodeFromPosition(300) |
          BitmaskUtils.encodeFromPosition(400),
      },
    ])(
      "Should combine multiple bitmasks into one",
      ({ bitmasks, expected }) => {
        const result = BitmaskUtils.combineBitmasks(bitmasks);
        expect(result).toStrictEqual(expected);
      }
    );
  });

  describe("decodeFromBase64", () => {
    it.each([
      { base64: "MA==", expected: BigInt(0b0) },
      { base64: "MQ==", expected: BigInt(0b1) },
      { base64: "Mg==", expected: BigInt(0b10) },
      { base64: "NjY3", expected: BigInt(0b1010011011) },
      {
        base64: "MTI2NzY1MDYwMDIyODIyOTQwMTQ5NjcwMzIwNTM3Ng==",
        expected: BitmaskUtils.encodeFromPosition(100),
      },
    ])(
      "Should decode a base64 encoded bitmask for $base64",
      ({ base64, expected }) => {
        const result = BitmaskUtils.decodeFromBase64(base64);
        expect(result).toStrictEqual(expected);
      }
    );
  });

  describe("encodeToBase64", () => {
    it.each([
      { bitmask: BigInt(0b0), expected: "MA==" },
      { bitmask: BigInt(0b1), expected: "MQ==" },
      { bitmask: BigInt(0b10), expected: "Mg==" },
      { bitmask: BigInt(0b1010011011), expected: "NjY3" },
      {
        bitmask: BitmaskUtils.encodeFromPosition(100),
        expected: "MTI2NzY1MDYwMDIyODIyOTQwMTQ5NjcwMzIwNTM3Ng==",
      },
    ])(
      "Should encode a bitmask to a base64 string for $bitmask",
      ({ bitmask, expected }) => {
        const result = BitmaskUtils.encodeToBase64(bitmask);
        expect(result).toStrictEqual(expected);
      }
    );

    it("Should encode and decode a bitmask from and to a base64 string", () => {
      const bitmask = BigInt(0b1010011011);
      const base64 = BitmaskUtils.encodeToBase64(bitmask);
      const result = BitmaskUtils.decodeFromBase64(base64);
      expect(result).toStrictEqual(bitmask);
    });

    it("Should encode and decode a bitmask from and to a base64 string with enormous numbers", () => {
      const bitmask = BitmaskUtils.encodeFromPosition(500);
      const base64 = BitmaskUtils.encodeToBase64(bitmask);
      const result = BitmaskUtils.decodeFromBase64(base64);
      expect(result).toStrictEqual(bitmask);
    });
  });
});
