import { LaraEvent } from "../basicEventbridgeClient";
import { PutEventsRequestEntry } from "aws-sdk/clients/eventbridge";
import type { ILogger } from "@alanszp/logger";
import type { SharedContext } from "@alanszp/shared-context";
import { compact } from "lodash";
import { createId } from "@paralleldrive/cuid2";

export function mapLaraEventToAWSEvent(
  { topic, body }: LaraEvent,
  env: string,
  appName: string,
  bus: string,
  logger: ILogger,
  context: SharedContext
): PutEventsRequestEntry | undefined {
  const lid = context.getLifecycleId() || createId();
  const oldlLch = context.getLifecycleChain();
  const lch = compact([oldlLch, "aws.eb"]).join(",");
  try {
    return {
      DetailType: topic,
      Detail: JSON.stringify({ ...body, lch, lid }), // lid is included here since the TraceHeader is not sent to the targets by aws
      Source: `${env}.lara.${appName}`,
      EventBusName: bus,
      Time: new Date(),
      TraceHeader: lid,
    };
  } catch {
    const org = body.organizationReference as string;
    logger.error("eventbridge.client.map_lara_to_aws_event.parse_error", {
      topic,
      org,
      lid,
    });
    return undefined;
  }
}
