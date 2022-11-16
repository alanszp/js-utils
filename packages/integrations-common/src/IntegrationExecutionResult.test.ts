import { SyncError } from "./types";
import {
  ChangesStatus,
  IntegrationExecutionResult,
} from "./IntegrationExecutionResult";

const MOCK_INTEGRATION_ID = "1";
const MOCK_ORGANIZATION_REFERENCE = "test";
const MOCK_EXECUTED_BY = "1";

describe("IntegrationHistory", () => {
  describe("setResults", () => {
    it("should return value with default values", () => {
      const i = new IntegrationExecutionResult(
        MOCK_INTEGRATION_ID,
        MOCK_ORGANIZATION_REFERENCE,
        MOCK_EXECUTED_BY
      );
      const pc: ChangesStatus = {
        created: ["1"],
        updated: ["1"],
        errors: [
          {
            type: SyncError.MISSING_FIELDS,
            userReference: "1",
            metadata: ["missingFieldName"],
          },
        ],
      };

      i.setResults(pc);

      expect(i.getResults()).toStrictEqual({
        totals: { added: 1, removed: 0, updated: 1, error: 1 },
        details: {
          added: ["1"],
          removed: [],
          updated: ["1"],
          error: [
            {
              type: SyncError.MISSING_FIELDS,
              userReference: "1",
              metadata: ["missingFieldName"],
            },
          ],
        },
      });
    });
  });
  describe("getters", () => {
    it("should return correct values", () => {
      const i = new IntegrationExecutionResult(
        MOCK_INTEGRATION_ID,
        MOCK_ORGANIZATION_REFERENCE,
        MOCK_EXECUTED_BY
      );
      expect(i.getExecutedBy()).toStrictEqual(MOCK_EXECUTED_BY);
      expect(i.getOrganizationReference()).toStrictEqual(
        MOCK_ORGANIZATION_REFERENCE
      );
      expect(i.getExecutedBy()).toStrictEqual(MOCK_EXECUTED_BY);
    });
  });
});
