import { clone } from "lodash";
import { generateChecksum } from "./generateChecksum";

const OBJECT_ONE = {
  id: "1",
  email: "test@checksum.com",
  checksum: "12345678",
  number: 1,
};

const OBJECT_TWO = {
  id: "2",
  email: "test2@checksum.com",
  checksum: "487654987",
  number: 2,
};

describe("generateChecksum", () => {
  it("should generate the same checksum for the same object", () => {
    const checksumOne = generateChecksum(OBJECT_ONE);
    const checksumTwo = generateChecksum(OBJECT_ONE);
    expect(checksumOne).toEqual(checksumTwo);
  });

  it("should generate a different checksum for different objects", () => {
    const checksumOne = generateChecksum(OBJECT_ONE);
    const checksumTwo = generateChecksum(OBJECT_TWO);
    expect(checksumOne).not.toEqual(checksumTwo);
  });

  it("should ignore some fields and produce the same checksum if its the only difference", () => {
    const OBJECT_THREE = clone(OBJECT_ONE);
    OBJECT_THREE.checksum = "NOT_THE_SAME";

    const ignoreFields = new Set<keyof typeof OBJECT_ONE>(["checksum"]);

    const checksumOne = generateChecksum(OBJECT_ONE, ignoreFields);
    const checksumTwo = generateChecksum(OBJECT_THREE, ignoreFields);
    expect(checksumOne).toEqual(checksumTwo);
  });
});
