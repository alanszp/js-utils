import { ILogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { chain, chunk, compact, omit, partition } from "lodash";
import {
  eventbridgeClient,
  EventRequest,
  PutEventEntryRequest,
  PutEventEntryResponse,
} from "./aws";
import { mapLaraEventToAWSEvent } from "./helpers/mapLaraEventToAWSEvent";

/**
 * Represents an event that is sent in the Lara ecosystem.
 *
 * @property topic: The topic of the event. E.g.: if an employee was created, topid would be employee.created.
 * @property body: The body of the event. This will be used to match in the rules, along with the topic and maybe the id. If it has a property id it
 *                  will be overwritten by the id sent to this method in the parameters.
 */
export type LaraEvent = {
  topic: string;
  body: Record<string, unknown>;
};

export type PutEventFailedEntryResponse = PutEventEntryResponse & {
  event: PutEventEntryRequest;
};

export interface EventDispatchResult {
  successful: PutEventEntryResponse[];
  failed: PutEventFailedEntryResponse[];
  failedCount: number | undefined;
}

/**
 * Max batch size for the putEvents request defined by AWS.
 */
const MAX_BATCH_SIZE = 10;

/**
 * Basic client for Eventbridge.
 * Usage will be done by extending this class and implementing methods that internally call the protected sendEvents method.
 */
export class BasicEventbridgeClient {
  private appName: string;
  private env: string;
  private bus: string;

  protected getLogger: () => ILogger;
  protected context: SharedContext;

  constructor(
    appName: string,
    env: string,
    getLogger: () => ILogger,
    context: SharedContext,
    bus: string
  ) {
    this.appName = appName;
    this.env = env;
    this.bus = bus;
    this.getLogger = getLogger;
    this.context = context;
  }

  protected async sendEvents(
    events: LaraEvent[]
  ): Promise<EventDispatchResult> {
    const logger = this.getLogger();

    const eventsToSend = chain(events)
      .map((event) =>
        mapLaraEventToAWSEvent(
          event,
          this.env,
          this.appName,
          this.bus,
          logger,
          this.context
        )
      )
      .compact()
      .map((event) => ({
        Entries: [event],
      }))
      .value();

    /**
     * Eventbridge in US-EAST-1 has a limit of 10.000 events/second.
     * We should be fine without a limiter here.
     */
    const results = await Promise.all(
      eventsToSend.map((singleEventArray) =>
        eventbridgeClient
          .putEvents(singleEventArray)
          .promise()
          .then(({ Entries, FailedEntryCount }) => ({
            FailedEntryCount,
            Entries: [
              {
                ...(Entries || [])[0],
                event: singleEventArray.Entries[0],
              },
            ],
          }))
          .catch((error) => ({
            FailedEntryCount: 1,
            Entries: [
              {
                EventId: undefined,
                ErrorMessage: JSON.stringify(error),
                event: singleEventArray.Entries[0],
              },
            ],
          }))
      )
    );

    const aggregatedResult = results.reduce(
      (prev, act) => {
        const { Entries: NewEntries, FailedEntryCount: newFailedCount } = act;
        const { eventsDispatched, failedCount } = prev;

        return {
          eventsDispatched: [
            ...(eventsDispatched || []),
            ...(NewEntries || []),
          ],
          failedCount: (failedCount || 0) + (newFailedCount || 0),
        };
      },
      {
        eventsDispatched: [],
        failedCount: 0,
      }
    );

    const { eventsDispatched, failedCount } = aggregatedResult;

    const [successful, failed] = partition(
      eventsDispatched,
      (entry) => entry.EventId
    );

    logger.info("eventbridge.client.sendEvents.end", {
      successful,
      failed,
    });

    return {
      successful: successful.map((eventDispatched) =>
        omit(eventDispatched, "event")
      ),
      failed,
      failedCount,
    };
  }
}
