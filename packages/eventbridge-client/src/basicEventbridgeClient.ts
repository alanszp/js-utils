import {
  eventbridgeClient,
  EventRequest,
  PromiseEventResponse,
  PutEventEntryResponse,
} from "./aws";
import { compact, partition } from "lodash";
import { mapLaraEventToAWSEvent } from "./helpers/mapLaraEventToAWSEvent";
import type { ILogger } from "@alanszp/logger";
import type { SharedContext } from "@alanszp/shared-context";

/**
 * Represents an event that is sent in the Lara ecosystem.
 *
 * @property topic: The topic of the event. E.g.: if an employee was created, topid would be employee.created.
 * @property lid: The lifecycle id to identify the execution that generated the event.
 * @property body: The body of the event. This will be used to match in the rules, along with the topic and maybe the id. If it has a property id it
 *                  will be overwritten by the id sent to this method in the parameters.
 */
export type LaraEvent = {
  topic: string;
  entity: Record<string, unknown>;
  modifiedKeys: string[];
};

export interface EmployeeEventDispatchResult {
  successful: PutEventEntryResponse[];
  failed: PutEventEntryResponse[];
  failedCount: number | undefined;
}

const DEFAULT_CUSTOM_BUS_NAME = "bus";

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
    bus: string = DEFAULT_CUSTOM_BUS_NAME,
    getLogger: () => ILogger,
    context: SharedContext
  ) {
    this.appName = appName;
    this.env = env;
    this.bus = bus;
    this.getLogger = getLogger;
    this.context = context;
  }

  protected async sendEvents(
    events: LaraEvent[]
  ): Promise<EmployeeEventDispatchResult> {
    const eventsToSend: EventRequest = {
      Entries: compact(
        events.map((event) =>
          mapLaraEventToAWSEvent(
            event,
            this.env,
            this.appName,
            this.bus,
            this.getLogger(),
            this.context
          )
        )
      ),
    };

    const result = await new AWS.EventBridge()
      .putEvents(eventsToSend)
      .promise();

    const { Entries, FailedEntryCount: failedCount } = result;

    this.getLogger().info(JSON.stringify(result));

    const [successful, failed] = partition(Entries, (entry) => entry.EventId);

    return {
      successful,
      failed,
      failedCount,
    };
  }
}
