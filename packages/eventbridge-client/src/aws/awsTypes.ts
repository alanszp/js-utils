import { PromiseResult as AWSPromiseResult } from "aws-sdk/lib/request";

export type EventRequest = AWS.EventBridge.Types.PutEventsRequest;
export type EventResponse = AWS.EventBridge.Types.PutEventsResponse;
export type AWSResponse<D, E> = AWS.Response<D, E>;
export type PromiseResult<D, E> = AWSPromiseResult<D, E>;
export type PutEventEntryResponse = AWS.EventBridge.PutEventsResultEntry;
export type PutEventEntryRequest = AWS.EventBridge.PutEventsRequestEntry;
export type EventError = AWS.AWSError;
export type PromiseEventResponse = PromiseResult<EventResponse, EventError>;
