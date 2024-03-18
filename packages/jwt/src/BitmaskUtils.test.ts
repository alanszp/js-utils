import { BitmaskUtils } from "./BitmaskUtils";
import Bignum from "bignum";

describe("BitmaskUtils", () => {
  describe("encodeFromPosition", () => {
    it.each([
      { position: 0, expected: new Bignum(0b1) },
      { position: 1, expected: new Bignum(0b10) },
      { position: 5, expected: new Bignum(0b100000) },
      { position: 10, expected: new Bignum(0b10000000000) },
      { position: 15, expected: new Bignum(0b1000000000000000) },
      { position: 30, expected: new Bignum(0b1000000000000000000000000000000) },
      {
        position: 31,
        expected: new Bignum(0b10000000000000000000000000000000),
      },
      // 32 is the maximum position for a 32-bit number - Node.js uses 32-bit numbers (when using unsigned ints), we should support more than 32 bits
      {
        position: 32,
        expected: new Bignum(0b100000000000000000000000000000000),
      },
      {
        position: 50,
        expected: new Bignum(
          0b100000000000000000000000000000000000000000000000000
        ),
      },
      {
        position: 100,
        expected: new Bignum(
          // To big to be represented as a number, but we can still test the result with a string representation
          "10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          2
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
        bitmask: new Bignum(0b1010),
        position: 3,
        expected: true,
      },
      {
        bitmask: new Bignum(0b1010),
        position: 2,
        expected: false,
      },
      {
        bitmask: new Bignum(0b1010),
        position: 1,
        expected: true,
      },
      {
        bitmask: new Bignum(0b1010),
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
  });

  describe("decodeFromBase64", () => {
    it.each([
      { base64: "MA==", expected: new Bignum(0b0) },
      { base64: "MQ==", expected: new Bignum(0b1) },
      { base64: "Mg==", expected: new Bignum(0b10) },
      { base64: "MzIz", expected: new Bignum(0b1010011011) },
      {
        base64: "MTIzNDU2Nzg5MA==",
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
});
