import { LaraEvent } from "../basicEventbridgeClient";
import { PutEventsRequestEntry } from "aws-sdk/clients/eventbridge";
import type { ILogger } from "@alanszp/logger";
import type { SharedContext } from "@alanszp/shared-context";
import { compact } from "lodash";
import cuid from "cuid";

export function mapLaraEventToAWSEvent<T>(
  { topic, entity }: LaraEvent,
  env: string,
  appName: string,
  bus: string,
  logger: ILogger,
  context: SharedContext
): PutEventsRequestEntry | undefined {
  const lid = context.getLifecycleId() || cuid();
  const oldlLch = context.getLifecycleChain();
  const lch = compact([oldlLch, "aws.eventbridge"]).join(",");
  try {
    return {
      DetailType: topic,
      Detail: JSON.stringify({ ...entity, lch }),
      Source: `${env}.lara.${appName}`,
      EventBusName: bus,
      Time: new Date(),
      TraceHeader: lid,
    };
  } catch (e: unknown) {
    const org = entity.organizationReference;
    logger.error(
      `Event with topic ${topic} and regarding org: ${org} and with lid: ${lid} could not be parsed to json string, will not be sent`
    );
    return undefined;
  }
}
