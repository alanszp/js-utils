import { ILogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { chain, chunk, compact, partition } from "lodash";
import { eventbridgeClient, EventRequest, PutEventEntryResponse } from "./aws";
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

export interface EventDispatchResult {
  successful: PutEventEntryResponse[];
  failed: PutEventEntryResponse[];
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
      .chunk(MAX_BATCH_SIZE)
      .map((mappedEventsChunk) => ({
        Entries: mappedEventsChunk,
      }))
      .value();

    const results = await Promise.all(
      eventsToSend.map((events) =>
        eventbridgeClient
          .putEvents(events)
          .promise()
          .then((...res) => {
            logger.info(JSON.stringify(res));
            return res[0];
          })
          .catch((...err) => {
            logger.error(JSON.stringify(err));
            return err[0];
          })
      )
    );

    const aggregatedResult = results.reduce(
      (prev, act) => {
        const { Entries: NewEntries, FailedEntryCount: newFailedCount } = act;
        const { Entries, FailedEntryCount } = prev;

        return {
          Entries: [...(Entries || []), ...(NewEntries || [])],
          FailedEntryCount: (FailedEntryCount || 0) + (newFailedCount || 0),
        };
      },
      {
        Entries: [],
        FailedEntryCount: 0,
      }
    );

    const { Entries, FailedEntryCount: failedCount } = aggregatedResult;

    const [successful, failed] = partition(Entries, (entry) => entry.EventId);

    logger.info("eventbridge.client.sendEvents.end", {
      successful,
      failed,
    });

    return {
      successful,
      failed,
      failedCount,
    };
  }
}
