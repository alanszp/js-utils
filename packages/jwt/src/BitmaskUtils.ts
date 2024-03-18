import Bignum from "bignum";

/**
 * Bitmask utility class
 * - Use to handle binary numbers
 * - Support binary numbers larger than 32 bits (Node.js uses 32-bit numbers)
 */
export class BitmaskUtils {
  /**
   * Encode a position into a binary number
   * @example Bitmask.encodeFromPosition(0) // 1 or 0b1
   * @example Bitmask.encodeFromPosition(1) // 2 or 0b10
   * @example Bitmask.encodeFromPosition(2) // 4 or 0b100
   * @example Bitmask.encodeFromPosition(3) // 8 or 0b1000
   */
  static encodeFromPosition(position: number): Bignum {
    return new Bignum(1).shiftLeft(position);
  }

  /**
   * Check if a bitmask has a specific bit set
   * @param bitmask - the bitmask to check
   * @param check - the bit to check (also a bitmask with only one bit set)
   * @example Bitmask.checkBitmask(0b1010, 0b1000) // true
   * @example Bitmask.checkBitmask(0b1010, 0b0100) // false
   */
  static checkBitmask(bitmask: Bignum, check: Bignum): boolean {
    return bitmask.and(check).eq(check);
  }

  /**
   * Decode a base64 encoded string into a binary number
   * @param base64 Base64 encoded bitmask
   * @returns The decoded bitmask
   * @example Bitmask.decodeFromBase64("AQ==") // 1 or 0b1
   * @example Bitmask.decodeFromBase64("Ag==") // 2 or 0b10
   */
  static decodeFromBase64(base64: string): Bignum {
    return Bignum.fromBuffer(Buffer.from(base64, "base64"));
  }
}
