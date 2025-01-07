import { EventBridge } from "@aws-sdk/client-eventbridge";

export function getEventbridgeClient(
  endpoint?: string,
  region?: string
): EventBridge {
  return new EventBridge(endpoint ? { endpoint, region } : {});
}
