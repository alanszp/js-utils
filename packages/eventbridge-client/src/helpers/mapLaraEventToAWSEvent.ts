import { LaraEvent } from "../basicEventbridgeClient";
import { PutEventsRequestEntry } from "aws-sdk/clients/eventbridge";
import type { ILogger } from "@alanszp/logger";
import type { SharedContext } from "@alanszp/shared-context";
import { compact } from "lodash";
import cuid from "cuid";

export function mapLaraEventToAWSEvent(
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
  } catch {
    const org = entity.organizationReference as string;
    logger.error("eventbridge.client.map_lara_to_aws_event.parse_error", {
      topic,
      org,
      lid,
    });
    return undefined;
  }
}
