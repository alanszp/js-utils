import { ILogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { compact, partition } from "lodash";
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

const DEFAULT_CUSTOM_BUS_NAME_SUFFIX = "lara-eventbus";

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
    bus = `${env}-${DEFAULT_CUSTOM_BUS_NAME_SUFFIX}`
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

    const eventsToSend: EventRequest = {
      Entries: compact(
        events.map((event) =>
          mapLaraEventToAWSEvent(
            event,
            this.env,
            this.appName,
            this.bus,
            logger,
            this.context
          )
        )
      ),
    };

    const result = await eventbridgeClient.putEvents(eventsToSend).promise();
    const { Entries, FailedEntryCount: failedCount } = result;
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
