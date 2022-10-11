import AWS from "aws-sdk";

export const getEventbridgeClient = (endpoint?: string, region?: string) =>
  new AWS.EventBridge(endpoint ? { endpoint, region } : {});
