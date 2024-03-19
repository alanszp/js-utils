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
  public static encodeFromPosition(position: number): bigint {
    return BigInt(1) << BigInt(position);
  }

  /**
   * Check if a bitmask has a specific bit set
   * @param bitmask - the bitmask to check
   * @param check - the bit to check (also a bitmask with only one bit set)
   * @example Bitmask.checkBitmask(0b1010, 0b1000) // true
   * @example Bitmask.checkBitmask(0b1010, 0b0100) // false
   */
  public static checkBitmask(bitmask: bigint, check: bigint): boolean {
    return (bitmask & check) === check;
  }

  /**
   * Combine multiple bitmasks into one
   * Uses the bitwise OR operator to combine the bitmasks
   * @param bitmasks - An array of bitmasks
   * @returns The combined bitmask
   * @example Bitmask.combineBitmasks([0b1000, 0b0100]) // 0b1100
   * @example Bitmask.combineBitmasks([0b1000, 0b0100, 0b0010]) // 0b1110
   */
  public static combineBitmasks(bitmasks: bigint[]): bigint {
    return bitmasks.reduce((acc, bitmask) => acc | bitmask, BigInt(0));
  }

  /**
   * Decode a base64 encoded string into a binary number
   * @param base64 Base64 encoded bitmask (valid utf-8 string of a number)
   * @returns The decoded bitmask
   * @example Bitmask.decodeFromBase64("AQ==") // 1 or 0b1
   * @example Bitmask.decodeFromBase64("Ag==") // 2 or 0b10
   */
  public static decodeFromBase64(base64: string): bigint {
    const string = Buffer.from(base64, "base64").toString("utf-8");
    return BigInt(string);
  }

  /**
   * Encode a binary number into a base64 string
   * @param bitmask The bitmask to encode
   * @returns The base64 encoded bitmask
   * @example Bitmask.encodeToBase64(1) // "AQ=="
   * @example Bitmask.encodeToBase64(2) // "Ag=="
   */
  public static encodeToBase64(bitmask: bigint): string {
    return Buffer.from(bitmask.toString()).toString("base64");
  }
}
