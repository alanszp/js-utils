import { createMockLogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { getEventbridgeClient } from "./aws/awsEventbridgeClient";
import { MockEventbridgeClient } from "./mockEventbridgeClient";
import {
  twoEventsToSend,
  twoSuccessfulResponses,
  twoUnsuccessfulResponses,
  oneSuccessfulOneUnsuccessfulResponses,
  topics,
  events,
} from "./mocks/fixtures/eventbridgeFixture";

jest.mock("./aws/awsEventbridgeClient");

const createClient = () =>
  new MockEventbridgeClient(
    "appName",
    "env",
    () => createMockLogger({}),
    new SharedContext(),
    "busName"
  );

describe("BasicEventbridgeClient", () => {
  describe("sendEvents", () => {
    describe("when there are two events", () => {
      describe("when they're all successful", () => {
        it("should send two requests, aggregate results, and show no failures", async () => {
          (getEventbridgeClient as jest.Mock).mockImplementationOnce(
            (_, __) => ({
              putEvents: jest
                .fn()
                .mockImplementationOnce((_) => ({
                  promise: () => Promise.resolve(twoSuccessfulResponses[0]),
                }))
                .mockImplementationOnce((_) => ({
                  promise: () => Promise.resolve(twoSuccessfulResponses[1]),
                })),
            })
          );

          const response = await createClient().mockSendEvents(twoEventsToSend);

          expect(response.failedCount).toBe(0);
          expect(response.successful.length).toBe(2);
          expect(response.failed.length).toBe(0);
        });
      });

      describe("when they're all unsuccessful", () => {
        it("should send two requests, aggregate results, and show two failures", async () => {
          (getEventbridgeClient as jest.Mock).mockImplementationOnce(
            (_, __) => ({
              putEvents: jest
                .fn()
                .mockImplementationOnce((_) => ({
                  promise: () => Promise.resolve(twoUnsuccessfulResponses[0]),
                }))
                .mockImplementationOnce((_) => ({
                  promise: () => Promise.resolve(twoUnsuccessfulResponses[1]),
                })),
            })
          );

          const response = await createClient().mockSendEvents(twoEventsToSend);

          expect(response.failedCount).toBe(2);
          expect(response.successful.length).toBe(0);
          expect(response.failed.length).toBe(2);
          expect(response.failed[0].event.DetailType).toBe(topics[0]);
          expect(
            JSON.parse(response.failed[0].event.Detail || "")
          ).toMatchObject({
            ...events[0],
            lch: "aws.eventbridge",
          });
          expect(response.failed[1].event.DetailType).toBe(topics[1]);
          expect(
            JSON.parse(response.failed[1].event.Detail || "")
          ).toMatchObject({
            ...events[1],
            lch: "aws.eventbridge",
          });
        });
      });

      describe("when one isn't successful", () => {
        it("should send two requests, aggregate results, and show one failure", async () => {
          (getEventbridgeClient as jest.Mock).mockImplementationOnce(
            (_, __) => ({
              putEvents: jest
                .fn()
                .mockImplementationOnce((_) => ({
                  promise: () =>
                    Promise.resolve(oneSuccessfulOneUnsuccessfulResponses[0]),
                }))
                .mockImplementationOnce((_) => ({
                  promise: () =>
                    Promise.resolve(oneSuccessfulOneUnsuccessfulResponses[1]),
                })),
            })
          );

          const response = await createClient().mockSendEvents(twoEventsToSend);

          expect(response.failedCount).toBe(1);
          expect(response.successful.length).toBe(1);
          expect(response.failed.length).toBe(1);
          expect(response.failed[0].event.DetailType).toBe(topics[1]);
          expect(
            JSON.parse(response.failed[0].event.Detail || "")
          ).toMatchObject({
            ...events[1],
            lch: "aws.eventbridge",
          });
        });
      });
    });

    describe("when a request to eventbridge fails", () => {
      it("shouldn't break following requests and should count as a failure", async () => {
        (getEventbridgeClient as jest.Mock).mockImplementationOnce((_, __) => ({
          putEvents: jest
            .fn()
            .mockImplementationOnce((_) => ({
              promise: () => Promise.reject(),
            }))
            .mockImplementationOnce((_) => ({
              promise: () => Promise.resolve(twoSuccessfulResponses[1]),
            })),
        }));

        const response = await createClient().mockSendEvents(twoEventsToSend);

        expect(response.failedCount).toBe(1);
        expect(response.successful.length).toBe(1);
        expect(response.failed.length).toBe(1);
        expect(response.failed[0].event.DetailType).toBe(topics[0]);
        expect(JSON.parse(response.failed[0].event.Detail || "")).toMatchObject(
          {
            ...events[0],
            lch: "aws.eventbridge",
          }
        );
      });
    });
  });
});
