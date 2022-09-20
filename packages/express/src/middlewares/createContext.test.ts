import { createContext } from "./createContext";
import { SharedContext } from "@alanszp/shared-context";
import { createMockLogger } from "@alanszp/logger";
import { createAuditLogger } from "@alanszp/audit";
import {
  mockNext,
  mockRequest,
  mockRequestWithBody,
  mockResponse,
} from "../test/mocks/expressMocks";
import { appIdentifier } from "../../dist/helpers/appIdentifier";
jest.mock("@alanszp/shared-context");

const logger = createMockLogger({});
const sharedContext = new SharedContext();
const lifecycleId = "123";
const lifecycleChain = "node:test";

describe("CreateContext", () => {
  describe("when has lifecycle headers", () => {
    beforeAll(() => {
      (SharedContext as jest.Mock).mockClear();
    });
    it("should get lifecycle identifiers from there", () => {
      const middleware = createContext(
        sharedContext,
        logger,
        createAuditLogger(logger)
      );

      middleware(
        mockRequest("authToken", {
          "x-lifecycle-chain": lifecycleChain,
          "x-lifecycle-id": lifecycleId,
        }),
        mockResponse(),
        mockNext()
      );

      expect(sharedContext.run).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          lifecycleId,
          lifecycleChain: `${lifecycleChain},${appIdentifier()}`,
        })
      );
    });
  });

  describe("when doesn't have lifecycle headers", () => {
    beforeAll(() => {
      (SharedContext as jest.Mock).mockClear();
    });
    it("should get lifecycle identifiers from body.detail", () => {
      const middleware = createContext(
        sharedContext,
        logger,
        createAuditLogger(logger)
      );

      middleware(
        mockRequestWithBody(
          "authToken",
          {},
          {
            detail: {
              lch: lifecycleChain,
              lid: lifecycleId,
            },
          }
        ),
        mockResponse(),
        mockNext()
      );

      expect(sharedContext.run).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          lifecycleId,
          lifecycleChain: `${lifecycleChain},${appIdentifier()}`,
        })
      );
    });
  });
});
