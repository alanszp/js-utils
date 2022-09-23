import { createMockLogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { eventbridgeClient } from "./aws/awsEventbridgeClient";
import { MockEventbridgeClient } from "./mockEventbridgeClient";
import { fifteenEventsFixture } from "./mocks/fixtures/eventbridgeFixture";

const {
  eventsToSend,
  allSuccessfulResponses,
  allUnsuccessfulResponses,
  sevenUnsuccessfulResponses,
} = fifteenEventsFixture;

jest.mock("./aws/awsEventbridgeClient");

const client = new MockEventbridgeClient(
  "appName",
  "env",
  () => createMockLogger({}),
  new SharedContext(),
  "busName"
);

describe("BasicEventbridgeClient", () => {
  describe("sendEvents", () => {
    describe("when there are more than 10 events", () => {
      describe("when they're all successful", () => {
        it("should send two requests, aggregate results, and show no failures", async () => {
          (eventbridgeClient.putEvents as jest.Mock)
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(allSuccessfulResponses.firstResponse),
            }))
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(allSuccessfulResponses.secondResponse),
            }));

          const response = await client.mockSendEvents(eventsToSend);

          expect(eventbridgeClient.putEvents).toHaveBeenCalledTimes(2);
          expect(response.failedCount).toBe(0);
          expect(response.successful.length).toBe(15);
          expect(response.failed.length).toBe(0);
        });
      });
      describe("when they're all successful", () => {
        it("should send two requests, aggregate results, and show fifteen failures", async () => {
          (eventbridgeClient.putEvents as jest.Mock)
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(allUnsuccessfulResponses.firstResponse),
            }))
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(allUnsuccessfulResponses.secondResponse),
            }));

          const response = await client.mockSendEvents(eventsToSend);

          expect(eventbridgeClient.putEvents).toHaveBeenCalledTimes(2);
          expect(response.failedCount).toBe(15);
          expect(response.successful.length).toBe(0);
          expect(response.failed.length).toBe(15);
        });
      });
      describe("when eight are successful", () => {
        it("should send two requests, aggregate results, and show seven failures", async () => {
          (eventbridgeClient.putEvents as jest.Mock)
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(sevenUnsuccessfulResponses.firstResponse),
            }))
            .mockImplementationOnce((_) => ({
              promise: () =>
                Promise.resolve(sevenUnsuccessfulResponses.secondResponse),
            }));

          const response = await client.mockSendEvents(eventsToSend);

          expect(eventbridgeClient.putEvents).toHaveBeenCalledTimes(2);
          expect(response.failedCount).toBe(7);
          expect(response.successful.length).toBe(8);
          expect(response.failed.length).toBe(7);
        });
      });
    });
  });
});
