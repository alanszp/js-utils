import { BaseModel, ModelValidationError } from "@alanszp/validations";
import { IsDefined } from "class-validator";
import { SubscribedEvent, isSubscribedEvent } from "./types/SubscribedEvent";

export interface ISubscribedEventInput<T> {
  event: SubscribedEvent<T>;
}

export class SubscribedEventInput<
    T extends Record<string, unknown> = Record<string, unknown>
  >
  extends BaseModel
  implements ISubscribedEventInput<T>
{
  @IsDefined()
  public event: SubscribedEvent<T>;

  constructor(event: SubscribedEvent<T>) {
    super();
    this.event = event;
  }

  static fromEventPayload<
    T extends Record<string, unknown> = Record<string, unknown>
  >(payload: { event: SubscribedEvent<T> }) {
    return new SubscribedEventInput(payload.event);
  }

  async validate(): Promise<void> {
    await super.validate();
    if (!isSubscribedEvent(this.event))
      throw new ModelValidationError([
        {
          property: "event",
          constraints: {
            missingProps: "event is not a queued notification",
          },
        },
      ]);
  }

  getEventData(): T {
    return this.event.detail;
  }

  getEventId(): string {
    return this.event.id;
  }

  getEventTopic(): string {
    return this.event["detail-type"];
  }

  getEventSource(): string {
    return this.event.source;
  }

  getEventTimestamp(): string {
    return this.event.time;
  }
}
